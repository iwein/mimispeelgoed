package com.mimi

import domain.MimiProduct
import domain.MimiProduct._

trait TestData {
  val mimiProduct: MimiProduct = MimiProduct(
    "Title", "description", Some("paymentLink"), "http://image", Set("tag", "tog", "tug")
  )
}