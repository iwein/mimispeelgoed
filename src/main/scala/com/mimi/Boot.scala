package com.mimi

import org.slf4j.LoggerFactory
import akka.config.Supervision._
import akka.actor.{Supervisor, Actor}
import cc.spray.{SprayCanRootService, HttpService}
import cc.spray.can.{ServerConfig, HttpServer}

object Boot extends App {

  LoggerFactory.getLogger(getClass) // initialize SLF4J early

  val mainModule = new MimiService {
    // bake your module cake here
  }

  val host = "0.0.0.0"
  val port = Option(System.getenv("PORT")).getOrElse("8080").toInt

  val httpService    = Actor.actorOf(new HttpService(mainModule.staticResourceService))
  val productService    = Actor.actorOf(new HttpService(mainModule.productService))
//  val postService    = Actor.actorOf(new HttpService(mainModule.postService))

  val rootService    = Actor.actorOf(new SprayCanRootService(httpService, productService))
  val sprayCanServer = Actor.actorOf(new HttpServer(new ServerConfig(host = host, port = port)))

  Supervisor(
    SupervisorConfig(
      OneForOneStrategy(List(classOf[Exception]), 3, 100),
      List(
        Supervise(httpService, Permanent),
        Supervise(productService, Permanent),
        Supervise(rootService, Permanent),
        Supervise(sprayCanServer, Permanent)
      )
    )
  )
}