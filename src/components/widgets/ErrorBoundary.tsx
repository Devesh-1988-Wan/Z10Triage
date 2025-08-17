// src/components/widgets/ErrorBoundary.tsx
import React, { Component, ErrorInfo, ReactNode } from "react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { AlertCircle, RefreshCw } from "lucide-react";

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: undefined,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Uncaught error:", error, errorInfo);
  }
  
  private handleRetry = () => {
    this.setState({ hasError: false, error: undefined });
  }

  public render() {
    if (this.state.hasError) {
      return (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Something went wrong</AlertTitle>
          <AlertDescription>
            <p>This widget could not be loaded.</p>
            {process.env.NODE_ENV === 'development' && (
              <pre className="mt-2 text-xs bg-gray-100 p-2 rounded">
                {this.state.error?.message}
              </pre>
            )}
             <Button variant="secondary" size="sm" onClick={this.handleRetry} className="mt-2">
                <RefreshCw className="h-3 w-3 mr-1" />
                Retry
             </Button>
          </AlertDescription>
        </Alert>
      );
    }

    return this.props.children;
  }
}