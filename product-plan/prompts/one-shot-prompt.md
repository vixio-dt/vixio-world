# Vixio Worldbuilder - Implementation Prompt

## Context

You are implementing Vixio Worldbuilder, a cloud-based worldbuilding tool for filmmakers creating virtual productions. The product has been fully designed in Design OS and this is the implementation handoff.

## Before You Start

Please confirm the following:

1. **Tech Stack**: React 19, TypeScript, Tailwind CSS v4, Supabase, Railway.app
2. **Auth Strategy**: Supabase Auth (email/password to start, can add OAuth later)
3. **Any existing codebase** to integrate with? Or fresh start?

## Your Task

Build the Vixio Worldbuilder application following the specifications in this package:

### 1. Foundation
- Set up React + Vite + TypeScript project
- Configure Tailwind CSS v4 with design tokens
- Set up Supabase client and auth

### 2. Database Schema
Implement the data model in Supabase PostgreSQL:
- User (from Supabase Auth)
- World, Character, Location, Organization, Event, Item, Rule
- Story, Scene, Shot
- Junction tables for relationships

### 3. Application Shell
- Sidebar navigation with logo
- World switcher
- User menu with auth
- Responsive layout

### 4. Sections (in order)
1. Dashboard - World overview and stats
2. Characters - CRUD with relationships
3. Locations - Hierarchical tree + list views
4. Rules - Grouped by category
5. Stories - With nested Scenes and Shots
6. Chat - AI interface (can stub initially)
7. Organizations, Timeline, Items, Export

### 5. Design Requirements
- Use Sky (#48BBF1) as primary color
- Use Teal as secondary
- Use Slate for neutrals
- Space Grotesk for headings
- Inter for body text
- Dark mode support

## Reference Files

- `product-overview.md` - Product context
- `design-system/colors.json` - Color tokens
- `design-system/typography.json` - Typography tokens
- `data-model/data-model.md` - Entity definitions
- `shell/spec.md` - Navigation specification
- `sections/[name]/spec.md` - Section requirements
- `sections/[name]/types.ts` - TypeScript interfaces

## Deliverables

A working Vixio application with:
- User authentication
- World management (create, switch, edit worlds)
- All 9 element categories (CRUD operations)
- Production pipeline (export functionality)
- Responsive design (desktop + mobile)
- Dark mode support
