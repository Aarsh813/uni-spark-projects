import { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { X, Plus } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/contexts/AuthContext'
import { useToast } from '@/hooks/use-toast'

type CreateProjectModalProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  onProjectCreated?: () => void
}

export function CreateProjectModal({ open, onOpenChange, onProjectCreated }: CreateProjectModalProps) {
  const { user } = useAuth()
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    requiredSkills: [] as string[],
    lookingForSkills: [] as string[]
  })
  
  const [newRequiredSkill, setNewRequiredSkill] = useState('')
  const [newLookingForSkill, setNewLookingForSkill] = useState('')

  const addSkill = (skill: string, type: 'required' | 'lookingFor') => {
    if (!skill.trim()) return
    
    if (type === 'required') {
      setFormData(prev => ({
        ...prev,
        requiredSkills: [...prev.requiredSkills, skill.trim()]
      }))
      setNewRequiredSkill('')
    } else {
      setFormData(prev => ({
        ...prev,
        lookingForSkills: [...prev.lookingForSkills, skill.trim()]
      }))
      setNewLookingForSkill('')
    }
  }

  const removeSkill = (skill: string, type: 'required' | 'lookingFor') => {
    if (type === 'required') {
      setFormData(prev => ({
        ...prev,
        requiredSkills: prev.requiredSkills.filter(s => s !== skill)
      }))
    } else {
      setFormData(prev => ({
        ...prev,
        lookingForSkills: prev.lookingForSkills.filter(s => s !== skill)
      }))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) return

    setLoading(true)
    try {
      const { error } = await supabase
        .from('projects')
        .insert([
          {
            title: formData.title,
            description: formData.description,
            required_skills: formData.requiredSkills,
            looking_for_skills: formData.lookingForSkills,
            author_id: user.id,
          },
        ])

      if (error) throw error

      toast({ title: 'Project created successfully!' })
      onOpenChange(false)
      onProjectCreated?.()
      
      // Reset form
      setFormData({
        title: '',
        description: '',
        requiredSkills: [],
        lookingForSkills: []
      })
    } catch (error: any) {
      toast({
        title: 'Error creating project',
        description: error.message,
        variant: 'destructive'
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create New Project</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="title">Project Title</Label>
            <Input
              id="title"
              placeholder="AI-Powered Campus Navigation App"
              value={formData.title}
              onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              placeholder="Describe your project, goals, and what you hope to accomplish..."
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              required
              rows={4}
            />
          </div>

          <div className="space-y-2">
            <Label>Required Skills</Label>
            <div className="flex gap-2">
              <Input
                placeholder="Add required skill"
                value={newRequiredSkill}
                onChange={(e) => setNewRequiredSkill(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault()
                    addSkill(newRequiredSkill, 'required')
                  }
                }}
              />
              <Button
                type="button"
                variant="outline"
                size="icon"
                onClick={() => addSkill(newRequiredSkill, 'required')}
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            <div className="flex flex-wrap gap-2">
              {formData.requiredSkills.map((skill) => (
                <Badge key={skill} variant="default" className="flex items-center gap-1">
                  {skill}
                  <button
                    type="button"
                    onClick={() => removeSkill(skill, 'required')}
                    className="ml-1 hover:bg-destructive/20 rounded-full p-0.5"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <Label>Looking for Skills</Label>
            <div className="flex gap-2">
              <Input
                placeholder="Add skill you're looking for"
                value={newLookingForSkill}
                onChange={(e) => setNewLookingForSkill(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault()
                    addSkill(newLookingForSkill, 'lookingFor')
                  }
                }}
              />
              <Button
                type="button"
                variant="outline"
                size="icon"
                onClick={() => addSkill(newLookingForSkill, 'lookingFor')}
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            <div className="flex flex-wrap gap-2">
              {formData.lookingForSkills.map((skill) => (
                <Badge key={skill} variant="secondary" className="flex items-center gap-1">
                  {skill}
                  <button
                    type="button"
                    onClick={() => removeSkill(skill, 'lookingFor')}
                    className="ml-1 hover:bg-destructive/20 rounded-full p-0.5"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              ))}
            </div>
          </div>

          <div className="flex gap-2 pt-4">
            <Button 
              type="button" 
              variant="outline" 
              className="flex-1"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button type="submit" className="flex-1" disabled={loading}>
              {loading ? 'Creating...' : 'Create Project'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}