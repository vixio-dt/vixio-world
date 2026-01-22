# Organizations Section Specification

## Overview

Manages factions, governments, companies, religions, and other collective entities in the world.

## Key Features

- Organization list with type filters
- Organization detail with member roster
- Hierarchy visualization
- Ally/enemy relationship mapping

## Data Fields

- name, type (government, religion, corporation, guild, family, military, secret_society)
- purpose, structure, leadership
- members (links to characters)
- territory, resources, beliefs, symbols
- allies, enemies (links to other organizations)
- history

## Components

- OrganizationCard: Summary with type badge and member count
- OrganizationList: Filterable grid of organization cards
- OrganizationDetail: Full view with tabs (Overview, Members, Relations, History)
- MemberRoster: Character list with roles within organization
