'use client'

import { useState, useRef, useCallback, useEffect } from 'react'
import { Textarea } from '@/components/ui'
import { MentionDropdown } from './MentionDropdown'
import { searchEntities, type SearchResult } from '@/lib/actions/search'

interface MentionInputProps {
  id: string
  name: string
  label?: string
  value: string
  onChange: (value: string) => void
  worldId: string
  placeholder?: string
  className?: string
}

// Mention format: @[type:id:name]
const MENTION_REGEX = /@\[(\w+):([a-f0-9-]+):([^\]]+)\]/g

export function MentionInput({
  id,
  name,
  label,
  value,
  onChange,
  worldId,
  placeholder,
  className,
}: MentionInputProps) {
  const [showDropdown, setShowDropdown] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [results, setResults] = useState<SearchResult[]>([])
  const [selectedIndex, setSelectedIndex] = useState(0)
  const [loading, setLoading] = useState(false)
  const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0 })
  const [mentionStartIndex, setMentionStartIndex] = useState<number | null>(null)
  
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  // Search for entities when query changes
  useEffect(() => {
    if (!showDropdown || !searchQuery) {
      setResults([])
      return
    }

    const timer = setTimeout(async () => {
      setLoading(true)
      try {
        const searchResults = await searchEntities(worldId, searchQuery, 8)
        setResults(searchResults)
        setSelectedIndex(0)
      } catch (error) {
        console.error('Search error:', error)
        setResults([])
      }
      setLoading(false)
    }, 150) // Debounce

    return () => clearTimeout(timer)
  }, [searchQuery, worldId, showDropdown])

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (!showDropdown) return

      if (e.key === 'ArrowDown') {
        e.preventDefault()
        setSelectedIndex((prev) => (prev + 1) % Math.max(results.length, 1))
      } else if (e.key === 'ArrowUp') {
        e.preventDefault()
        setSelectedIndex((prev) => (prev - 1 + Math.max(results.length, 1)) % Math.max(results.length, 1))
      } else if (e.key === 'Enter' && results.length > 0) {
        e.preventDefault()
        handleSelect(results[selectedIndex])
      } else if (e.key === 'Escape') {
        e.preventDefault()
        setShowDropdown(false)
      }
    },
    [showDropdown, results, selectedIndex]
  )

  const handleSelect = useCallback(
    (result: SearchResult) => {
      if (mentionStartIndex === null) return

      const beforeMention = value.slice(0, mentionStartIndex)
      const afterMention = value.slice(textareaRef.current?.selectionStart || mentionStartIndex)
      
      // Insert mention in format @[type:id:name]
      const mention = `@[${result.type}:${result.id}:${result.name}]`
      const newValue = beforeMention + mention + afterMention

      onChange(newValue)
      setShowDropdown(false)
      setSearchQuery('')
      setMentionStartIndex(null)

      // Focus back on textarea
      setTimeout(() => {
        const newCursorPos = beforeMention.length + mention.length
        textareaRef.current?.setSelectionRange(newCursorPos, newCursorPos)
        textareaRef.current?.focus()
      }, 0)
    },
    [mentionStartIndex, value, onChange]
  )

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      const newValue = e.target.value
      const cursorPos = e.target.selectionStart

      onChange(newValue)

      // Check if user just typed @
      const charBeforeCursor = newValue[cursorPos - 1]
      const charBeforeAt = cursorPos > 1 ? newValue[cursorPos - 2] : ' '

      if (charBeforeCursor === '@' && (charBeforeAt === ' ' || charBeforeAt === '\n' || cursorPos === 1)) {
        setShowDropdown(true)
        setMentionStartIndex(cursorPos - 1)
        setSearchQuery('')
        
        // Calculate dropdown position
        if (containerRef.current) {
          setDropdownPosition({
            top: 24, // Below the cursor line
            left: 0,
          })
        }
      } else if (showDropdown && mentionStartIndex !== null) {
        // Update search query
        const textAfterAt = newValue.slice(mentionStartIndex + 1, cursorPos)
        
        // Close dropdown if user typed space or newline
        if (textAfterAt.includes(' ') || textAfterAt.includes('\n')) {
          setShowDropdown(false)
          setMentionStartIndex(null)
        } else {
          setSearchQuery(textAfterAt)
        }
      }
    },
    [onChange, showDropdown, mentionStartIndex]
  )

  // Close dropdown on blur (with delay to allow click)
  const handleBlur = useCallback(() => {
    setTimeout(() => setShowDropdown(false), 200)
  }, [])

  return (
    <div ref={containerRef} className="relative">
      <Textarea
        ref={textareaRef}
        id={id}
        name={name}
        label={label}
        value={value}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        onBlur={handleBlur}
        placeholder={placeholder}
        className={className}
      />
      {showDropdown && (
        <MentionDropdown
          results={results}
          selectedIndex={selectedIndex}
          onSelect={handleSelect}
          position={dropdownPosition}
          loading={loading}
        />
      )}
    </div>
  )
}

/**
 * Parse mention markers and return array of mention references.
 */
export function parseMentions(text: string): { type: string; id: string; name: string }[] {
  const mentions: { type: string; id: string; name: string }[] = []
  let match

  const regex = new RegExp(MENTION_REGEX.source, 'g')
  while ((match = regex.exec(text)) !== null) {
    mentions.push({
      type: match[1],
      id: match[2],
      name: match[3],
    })
  }

  return mentions
}

/**
 * Render text with mentions as styled spans (for display).
 */
export function renderMentions(text: string): React.ReactNode[] {
  const parts: React.ReactNode[] = []
  let lastIndex = 0
  let match

  const regex = new RegExp(MENTION_REGEX.source, 'g')

  while ((match = regex.exec(text)) !== null) {
    // Add text before mention
    if (match.index > lastIndex) {
      parts.push(text.slice(lastIndex, match.index))
    }

    // Add styled mention
    const [, type, id, name] = match
    parts.push(
      <span
        key={`${type}-${id}-${match.index}`}
        className="inline-flex items-center gap-1 px-1.5 py-0.5 bg-sky-50 text-sky-700 rounded text-sm font-medium"
      >
        @{name}
      </span>
    )

    lastIndex = match.index + match[0].length
  }

  // Add remaining text
  if (lastIndex < text.length) {
    parts.push(text.slice(lastIndex))
  }

  return parts
}
