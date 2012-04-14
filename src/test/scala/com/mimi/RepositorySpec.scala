package com.mimi

import domain.MimiProduct
import org.specs2.mutable._
import cc.spray._
import test._
import http._
import HttpMethods._
import StatusCodes._
import com.novus.salat._
import com.novus.salat.global._

class RepositorySpec extends Specification with Repository with TestData {

  "The MimiRepository" should {
    "return a list of products" in {
      MongoRepository.products.drop()
      MongoRepository.products.insert(mimiProduct)
      val products: List[MimiProduct] = listProducts
      println(products)
      products must contain (mimiProduct)
    }

  }
  
}