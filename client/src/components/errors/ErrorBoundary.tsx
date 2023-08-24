import { Component, ReactNode, ErrorInfo } from 'react'
import ErrorPage from '../pages/ErrorPage'
import { error } from 'console'

interface Props {
  children?: ReactNode
}

interface State {
  hasError: boolean
  error?: Error
}

class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: undefined
  }

  public static getDerivedStateFromError(err: Error): State {
    // Update state so the next render will show the fallback UI.
    return { hasError: true, error: err }
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error(error)
  }

  public render() {
    if (this.state.hasError) {
      return <ErrorPage message={this.state.error && this.state.error.message} />
    }
    return this.props.children
  }
}

export default ErrorBoundary
