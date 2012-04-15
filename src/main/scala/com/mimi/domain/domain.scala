package com.mimi.domain

case class MimiProduct(title: String
                       , description: String
                       , paymentLink: String
                       , imageLink: String
                       , tags: Set[String] = Set.empty)