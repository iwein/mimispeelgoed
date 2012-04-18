package com.mimi.domain

case class Product(title: String
                       , description: String
                       , paymentLink: String
                       , imageLink: String
                       , tags: Set[String] = Set.empty)