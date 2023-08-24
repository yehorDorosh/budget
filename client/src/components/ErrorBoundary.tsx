import { Component, ReactNode, ErrorInfo } from 'react'

interface Props {
  children?: ReactNode
}

interface State {
  hasError: boolean
}

class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false
  }

  public static getDerivedStateFromError(_: Error): State {
    // Update state so the next render will show the fallback UI.
    return { hasError: true }
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error(error)
  }

  public render() {
    if (this.state.hasError) {
      return <p>Something went wrong!</p>
    }
    return this.props.children
  }
}

export default ErrorBoundary
