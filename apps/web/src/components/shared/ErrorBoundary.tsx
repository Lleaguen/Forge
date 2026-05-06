'use client'

import React, { Component, ErrorInfo, ReactNode } from 'react'
import { FiAlertTriangle, FiRefreshCw } from 'react-icons/fi'

interface Props {
  children: ReactNode
  fallback?: ReactNode
}

interface State {
  hasError: boolean
  error?: Error
  errorInfo?: ErrorInfo
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error: Error): State {
    return {
      hasError: true,
      error,
    }
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo)
    this.setState({
      error,
      errorInfo,
    })
  }

  handleReset = () => {
    this.setState({ hasError: false, error: undefined, errorInfo: undefined })
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback
      }

      return (
        <div className="flex min-h-[400px] flex-col items-center justify-center p-8">
          <div className="text-center">
            <div className="mb-4 flex justify-center">
              <div className="rounded-full bg-red-100 p-3 dark:bg-red-900/20">
                <FiAlertTriangle className="h-8 w-8 text-red-600 dark:text-red-400" />
              </div>
            </div>
            
            <h2 className="mb-2 text-xl font-semibold text-gray-900 dark:text-white">
              Something went wrong
            </h2>
            
            <p className="mb-6 text-gray-600 dark:text-gray-400">
              An unexpected error occurred. Please try refreshing the page.
            </p>

            {process.env.NODE_ENV === 'development' && this.state.error && (
              <details className="mb-6 text-left">
                <summary className="cursor-pointer text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200">
                  Error Details (Development)
                </summary>
                <pre className="mt-2 overflow-auto rounded bg-gray-100 p-4 text-xs text-gray-800 dark:bg-gray-800 dark:text-gray-200">
                  {this.state.error.toString()}
                  {this.state.errorInfo?.componentStack}
                </pre>
              </details>
            )}

            <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
              <button
                onClick={this.handleReset}
                className="inline-flex items-center gap-2 rounded-lg bg-brand-primary px-4 py-2 text-sm font-medium text-white hover:bg-brand-primary/90 focus:outline-none focus:ring-2 focus:ring-brand-primary focus:ring-offset-2"
              >
                <FiRefreshCw className="h-4 w-4" />
                Try Again
              </button>
              
              <button
                onClick={() => window.location.reload()}
                className="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-brand-primary focus:ring-offset-2 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
              >
                Refresh Page
              </button>
            </div>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}