import { Request, Response } from "express"
import Category from "../models/Category"

export const getCategories = async (
  _req: Request,
  res: Response
): Promise<void> => {
  try {
    const categories = await Category.find().sort({ name: 1 })

    res.status(200).json({
      success: true,
      data: categories,
    })
  } catch (error) {
    console.error("Error fetching categories:", error)

    res.status(500).json({
      success: false,
      message: "Failed to fetch categories.",
    })
  }
}

export const createCategory = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { name, description } = req.body

    if (!name || !description) {
      res.status(400).json({
        success: false,
        message: "Category name and description are required.",
      })
      return
    }

    const existingCategory = await Category.findOne({
      name: name.trim(),
    })

    if (existingCategory) {
      res.status(409).json({
        success: false,
        message: "A category with this name already exists.",
      })
      return
    }

    const category = await Category.create({
      name: name.trim(),
      description: description.trim(),
    })

    res.status(201).json({
      success: true,
      message: "Category created successfully.",
      data: category,
    })
  } catch (error) {
    console.error("Error creating category:", error)

    res.status(500).json({
      success: false,
      message: "Failed to create category.",
    })
  }
}

export const updateCategory = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params
    const { name, description } = req.body

    if (!name || !description) {
      res.status(400).json({
        success: false,
        message: "Category name and description are required.",
      })
      return
    }

    const existingCategory = await Category.findOne({
      name: name.trim(),
      _id: { $ne: id },
    })

    if (existingCategory) {
      res.status(409).json({
        success: false,
        message: "A category with this name already exists.",
      })
      return
    }

    const category = await Category.findByIdAndUpdate(
      id,
      {
        name: name.trim(),
        description: description.trim(),
      },
      {
        new: true,
      }
    )

    if (!category) {
      res.status(404).json({
        success: false,
        message: "Category not found.",
      })
      return
    }

    res.status(200).json({
      success: true,
      message: "Category updated successfully.",
      data: category,
    })
  } catch (error) {
    console.error("Error updating category:", error)

    res.status(500).json({
      success: false,
      message: "Failed to update category.",
    })
  }
}

export const deleteCategory = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params

    const category = await Category.findByIdAndDelete(id)

    if (!category) {
      res.status(404).json({
        success: false,
        message: "Category not found.",
      })
      return
    }

    res.status(200).json({
      success: true,
      message: "Category deleted successfully.",
    })
  } catch (error) {
    console.error("Error deleting category:", error)

    res.status(500).json({
      success: false,
      message: "Failed to delete category.",
    })
  }
}