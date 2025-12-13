import { useState } from 'react'
import { Button } from '@/components/ui/button'

function App() {
  const [count, setCount] = useState(0)

  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-8 p-8">
      <h1 className="text-4xl font-bold">Vite + React + shadcn/ui</h1>

      <div className="flex flex-col items-center gap-4">
        <Button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </Button>

        <div className="flex gap-2">
          <Button variant="secondary">Secondary</Button>
          <Button variant="outline">Outline</Button>
          <Button variant="ghost">Ghost</Button>
          <Button variant="destructive">Destructive</Button>
        </div>
      </div>

      <p className="text-muted-foreground">
        Edit <code className="bg-muted px-1 py-0.5 rounded">src/App.tsx</code> and save to test HMR
      </p>
    </div>
  )
}

export default App
