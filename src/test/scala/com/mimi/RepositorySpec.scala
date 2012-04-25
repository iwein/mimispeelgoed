package com.mimi

import domain.MimiProduct
import org.specs2.mutable._
import cc.spray._
import test._
import http._
import com.novus.salat._
import com.novus.salat.global._

class RepositorySpec extends Specification with MongoRepository with TestData {

  "The MimiRepository" should {
    "return a list of products" in {
      productsCollection.drop()
      productsCollection.insert(mimiProduct)
      val products: List[MimiProduct] = listProducts
      println(products)
      products must contain (mimiProduct)
    }
    "return a list of labels" in {
      productsCollection.drop()
      productsCollection.insert(mimiProduct)
      productsCollection.insert(mimiProduct.copy(tags = Set("tag", "tig")))
      listTags must_== Set("tag", "tog", "tug", "tig")
    }
  }
  
}