import { render } from '@testing-library/react';
import { Button, buttonVariants } from '../components/ui/button';
import { Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent } from '../components/ui/card';
import { describe, it, expect } from 'vitest';

describe('UI Components', () => {
  it('renders Button with different variants', () => {
    const { getByText, rerender } = render(<Button variant="default">Default</Button>);
    expect(getByText('Default')).toBeInTheDocument();
    
    rerender(<Button variant="destructive">Destructive</Button>);
    expect(getByText('Destructive')).toBeInTheDocument();

    rerender(<Button variant="outline">Outline</Button>);
    expect(getByText('Outline')).toBeInTheDocument();

    rerender(<Button variant="secondary">Secondary</Button>);
    expect(getByText('Secondary')).toBeInTheDocument();

    rerender(<Button variant="ghost">Ghost</Button>);
    expect(getByText('Ghost')).toBeInTheDocument();

    rerender(<Button variant="link">Link</Button>);
    expect(getByText('Link')).toBeInTheDocument();
    
    rerender(<Button size="sm">Small</Button>);
    expect(getByText('Small')).toBeInTheDocument();
    
    rerender(<Button size="lg">Large</Button>);
    expect(getByText('Large')).toBeInTheDocument();
    
    rerender(<Button size="icon">Icon</Button>);
    expect(getByText('Icon')).toBeInTheDocument();
    
    rerender(<Button asChild><a href="#">Link</a></Button>);
    expect(getByText('Link')).toBeInTheDocument();
  });

  it('renders Card components', () => {
    const { getByText } = render(
      <Card>
        <CardHeader>
          <CardTitle>Title</CardTitle>
          <CardDescription>Description</CardDescription>
        </CardHeader>
        <CardContent>Content</CardContent>
        <CardFooter>Footer</CardFooter>
      </Card>
    );

    expect(getByText('Title')).toBeInTheDocument();
    expect(getByText('Description')).toBeInTheDocument();
    expect(getByText('Content')).toBeInTheDocument();
    expect(getByText('Footer')).toBeInTheDocument();
  });
});
