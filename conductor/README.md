# Conductor Orchestration

This directory contains the structural and procedural logic for the project's development, orchestrated by the **Gemini CLI Conductor extension**.

## 🧠 What is Conductor?

Conductor is a framework for managing complex software development tasks using AI agents. It organizes the project into:

-   **Product Vision:** Defining the "What" and "Why" (`product.md`).
-   **Tech Stack:** Selecting the tools (`tech-stack.md`).
-   **Tracks:** Sequential or parallel milestones for implementation (`tracks/`).
-   **Guidelines:** Enforcing consistent code style and product standards (`product-guidelines.md`, `code_styleguides/`).

## 🤖 Developed with Gemini CLI

This project was developed through the **Conductor** extension of [Gemini CLI](https://github.com/google/gemini-cli). 

The agents use the files in this directory as their "source of truth" for:
1.  **Architecture:** Following the defined tech stack.
2.  **State:** Tracking progress through "Tracks".
3.  **Context:** Understanding the product requirements without manual explanation.

## 📁 Directory Structure

-   `product.md`: High-level vision and features.
-   `tech-stack.md`: Documentation of the chosen technologies.
-   `tracks/`: Contains specific implementation plans and metadata for each milestone.
-   `code_styleguides/`: Technical standards for TypeScript, CSS, and general coding.
