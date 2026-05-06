'use client'

import { Button } from '@/components/shared'

interface TagInputProps {
  tags: string[]
  tagInput: string
  onTagInputChange: (value: string) => void
  onAddTag: () => void
  onRemoveTag: (tag: string) => void
  canAddTag?: boolean
  maxTags?: number
}

export function TagInput({ 
  tags, 
  tagInput, 
  onTagInputChange, 
  onAddTag, 
  onRemoveTag,
  canAddTag = true,
  maxTags = 10 
}: TagInputProps) {
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      onAddTag()
    }
  }

  return (
    <>
      <div className="flex gap-2 mb-2">
        <input
          type="text"
          value={tagInput}
          onChange={(e) => onTagInputChange(e.target.value)}
          onKeyDown={handleKeyDown}
          className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Add a tag..."
          maxLength={50}
        />
        <Button
          type="button"
          onClick={onAddTag}
          variant="outline"
          disabled={!canAddTag}
          className="h-10 px-4"
        >
          Add
        </Button>
      </div>
      
      {tags.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-2">
          {tags.map(tag => (
            <span
              key={tag}
              className="inline-flex items-center px-2 py-1 bg-blue-100 text-blue-800 text-sm rounded-md"
            >
              {tag}
              <button
                type="button"
                onClick={() => onRemoveTag(tag)}
                className="ml-1 text-blue-600 hover:text-blue-800"
              >
                ×
              </button>
            </span>
          ))}
        </div>
      )}
      
      <p className="text-xs text-gray-500">
        {tags.length}/{maxTags} tags used
      </p>
    </>
  )
}