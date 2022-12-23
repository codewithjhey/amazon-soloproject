import { checkSchema, validationResult } from "express-validator"
import createHttpError from "http-errors"

const productSchema = {
  name: {
    in: ["body"],
    isString: {
      errorMessage:
        "Name of the product is a mandatory field and needs to be a String."
    }
  },
  description: {
    in: ["body"],
    isString: {
      errorMessage:
        "Description  of the product is a mandatory field and needs to be a String."
    }
  },
  brand: {
    in: ["body"],
    isString: {
      errorMessage:
        "Brand of the product is a mandatory field and needs to be a String."
    }
  },
  imageUrl: {
    in: ["body"],
    isString: {
      errorMessage:
        "Image of the product is a mandatory field. Please supply a URL to an image."
    }
  },
  price: {
    in: ["body"],
    isInt: {
      errorMessage:
        "price of the product is a mandatory field and needs to be a number."
    }
  },
  category: {
    in: ["body"],
    isString: {
      errorMessage:
        "Category of the product is a mandatory field and needs to be a String."
    }
  }
}

const reviewSchema = {
  comment: {
    in: ["body"],
    isString: {
      errorMessage: "Comment text is mandatory and must be a string"
    }
  },
  rate: {
    in: ["body"],
    isInt: {
      errorMessage: "Rate is mandatory and must be a number"
    }
  },
  productId: {
    in: ["body"],
    isString: {
      errorMessage: "Product ID is mandatory and must be a string"
    }
  }
}

export const checksPostSchema = checkSchema(productSchema)
export const checksReviewSchema = checkSchema(reviewSchema)

export const triggerBadRequest = (req, res, next) => {
  const errors = validationResult(req)

  console.log(errors.array())

  if (!errors.isEmpty()) {
    next(
      createHttpError(400, "Errors during Product validation", {
        errorsList: errors.array()
      })
    )
  } else {
    next()
  }
}

export const triggerReviewBadRequest = (req, res, next) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    next(
      createHttpError(400, "Errors during Review validation", {
        errorsList: errors.array()
      })
    )
  } else {
    next()
  }
}
