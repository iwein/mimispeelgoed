package com.mimi

import org.specs2.mutable._
import cc.spray._
import test._
import http._
import HttpMethods._
import StatusCodes._

class ServiceSpec extends Specification with SprayTest with OilService {
  
  "The OilService" should {
    "return the index for GET requests to the root path" in {
      testService(HttpRequest(GET, "/")) {
        staticResourceService
      }.response.content.as[String].right.getOrElse("Failed") must contain ("MimiSpeelgoed")
    }
    "leave GET requests to random paths unhandled" in {
      testService(HttpRequest(GET, "/kermit")) {
        staticResourceService
      }.handled must beFalse
    }
    "return a MethodNotAllowed error for POST requests to the root path" in {
      testService(HttpRequest(POST, "/")) {
        staticResourceService
      }.response mustEqual HttpResponse(MethodNotAllowed, "HTTP method not allowed, supported methods: GET")
    }
    "return a list of products on /products" in {
      val result = testService(HttpRequest(GET, "/products")) {
        productService
      }
      result.handled must beTrue
    }
  }
  
}