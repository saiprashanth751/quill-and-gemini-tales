# KathaVerse: Your AI Story Weaver

Unleash your imagination and craft captivating tales with the power of AI.

---

## Table of Contents

1. [Project Overview](#project-overview)
2. [Features](#features)
3. [Tech Stack](#tech-stack)
4. [Architecture](#architecture)
5. [Getting Started](#getting-started)
---

## Project Overview

KathaVerse is an innovative web application that empowers storytellers, writers, and creative enthusiasts to overcome writer’s block and rapidly prototype engaging narratives. Using AI-driven content generation, KathaVerse transforms text, voice, or image inputs into structured stories across multiple genres and styles.

## Features

* **Intelligent Story Generation**

  * **Text Input**: Enter plot details, characters, and setting to generate unique stories.
  * **Voice Input**: Speak your ideas; AI transcribes and crafts the narrative.
  * **Image Input**: Upload an image to inspire a story based on visual cues.

* **Customizable Parameters**

  * **Genre**: Choose from Fantasy, Sci-Fi, Mystery, Horror, Adventure, Romance, and more.
  * **Perspective**: First-person, Second-person, or Third-person narration.
  * **Format**: Traditional narrative or dialogue-only scripts.
  * **Mood & Setting**: Control atmosphere (e.g., weather, season, emotional tone).
  * **Time Period**: Place stories in Ancient, Medieval, Modern, or future settings.
  * **Length**: Specify Short, Medium, or Long story lengths.

* **Immersive Experience**

  * **Background Music**: Play, pause, and control volume for mood-enhancing tracks.
  * **Text-to-Speech**: Listen to stories with adjustable speed, voice selection, and sentence highlighting.

* **User Interface**

  * **Responsive Design**: Fluid layout for desktop, tablet, and mobile.
  * **Animations**: Smooth, cascading effects for an immersive reading experience.
  * **Theme Toggle**: Light and dark mode support.

## Tech Stack

* **Frontend**

  * **React** & **TypeScript**
  * **Vite** for fast development and builds
  * **Tailwind CSS** & **shadcn/ui** for styling and accessible components
  * **react-router-dom**, **@tanstack/react-query**, **react-hook-form** & **zod**
  * **Web Speech API** for voice input and text-to-speech

* **AI/ML**

  * **Google Gemini API** for story generation and multimodal input processing

## Architecture

KathaVerse is a Single-Page Application (SPA) with client-side AI integration:

1. **User Input**: Handled by `StoryForm.tsx`, capturing text, voice, or image data.
2. **API Module**: `geminiApi.ts` constructs prompts, manages requests, and caches responses with in-memory store.
3. **Story Rendering**: `StoryOutput.tsx` displays generated text and rich media controls (music, TTS).
4. **UI Components**: A suite of reusable Shadcn UI components ensures consistency and accessibility.

*Client → Google Gemini API → Client*

## Getting Started

### Prerequisites

* **Node.js** v18 or higher
* **npm**

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/kathaverse.git
cd kathaverse

# Install dependencies
npm install
```

### Development

```bash
# Start the dev server
npm run dev
```

Visit `http://localhost:8080` in your browser to explore KathaVerse.

### Production Build

```bash
npm run build
```

Compiled files will be in the `dist` folder, ready for deployment.
