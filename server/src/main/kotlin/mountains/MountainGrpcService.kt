package mountains

import org.springframework.grpc.server.service.GrpcService
import org.springframework.stereotype.Service
import java.util.UUID
import java.util.Collections
import io.grpc.Status
import io.grpc.stub.StreamObserver
//import mountains.MountainServiceGrpc
import mountains.Mountains.Empty
import mountains.Mountains.Mountain
import mountains.Mountains.MountainList
import mountains.Mountains.MountainRequestId

@Service
@GrpcService
class MountainGrpcService : MountainServiceGrpc.MountainServiceImplBase() {

    // Using a thread-safe list for concurrent access
    private val peaks = Collections.synchronizedList(mutableListOf(
        Peak(
            id = "a48a6488-fba6-11ea-adc1-0242ac120002",
            name = "Mt. Washington",
            elevation = 1917,
            location = "44_16_13.8_N_71_18_11.7_W"
        ),
        Peak(
            id = "a48a8cce-fba6-11ea-adc1-0242ac120002",
            name = "Flatirons",
            elevation = 2484,
            location = "39.988_N_105.293_W"
        )
    ))

    private fun Peak.toGrpcMountain(): Mountain =
        Mountain.newBuilder()
            .setId(id)
            .setName(name)
            .setElevation(elevation)
            .setLocation(location)
            .build()

    override fun getAll(request: Empty, responseObserver: StreamObserver<MountainList>) {
        val mountainList = MountainList.newBuilder()
            .addAllMountains(peaks.map { it.toGrpcMountain() })
            .build()
        responseObserver.onNext(mountainList)
        responseObserver.onCompleted()
    }

    override fun get(request: MountainRequestId, responseObserver: StreamObserver<Mountain>) {
        val peak = peaks.find { it.id == request.id }
        if (peak != null) {
            responseObserver.onNext(peak.toGrpcMountain())
            responseObserver.onCompleted()
        } else {
            responseObserver.onError(
                Status.NOT_FOUND
                    .withDescription("Mountain not found with id: ${request.id}")
                    .asRuntimeException()
            )
        }
    }

    override fun insert(request: Mountain, responseObserver: StreamObserver<Mountain>) {
        val newPeak = Peak(
            id = UUID.randomUUID().toString(),
            name = request.name,
            elevation = request.elevation,
            location = request.location
        )
        peaks.add(newPeak)
        responseObserver.onNext(newPeak.toGrpcMountain())
        responseObserver.onCompleted()
    }

    override fun update(request: Mountain, responseObserver: StreamObserver<Mountain>) {
        val index = peaks.indexOfFirst { it.id == request.id }
        if (index != -1) {
            val updatedPeak = Peak(
                id = request.id,
                name = request.name,
                elevation = request.elevation,
                location = request.location
            )
            peaks[index] = updatedPeak
            responseObserver.onNext(updatedPeak.toGrpcMountain())
            responseObserver.onCompleted()
        } else {
            responseObserver.onError(
                Status.NOT_FOUND
                    .withDescription("Mountain not found with id: ${request.id}")
                    .asRuntimeException()
            )
        }
    }

    override fun remove(request: MountainRequestId, responseObserver: StreamObserver<Empty>) {
        val removed = peaks.removeIf { it.id == request.id }
        if (removed) {
            responseObserver.onNext(Empty.getDefaultInstance())
            responseObserver.onCompleted()
        } else {
            responseObserver.onError(
                Status.NOT_FOUND
                    .withDescription("Mountain not found with id: ${request.id}")
                    .asRuntimeException()
            )
        }
    }
}