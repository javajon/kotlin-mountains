package mountains

import org.springframework.boot.autoconfigure.SpringBootApplication
import org.springframework.boot.runApplication
import org.springframework.boot.context.properties.EnableConfigurationProperties

@SpringBootApplication
@EnableConfigurationProperties
class ServerApplication

fun main(args: Array<String>) {
	runApplication<ServerApplication>(*args)
}