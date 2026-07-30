import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import App from './App';
import axios from 'axios';
import { vi, describe, it, expect, beforeEach } from 'vitest';

// Mock axios
vi.mock('axios');
const mockedAxios = axios as unknown as { post: any };

// Mock ReactFlow since it requires a DOM environment with ResizeObserver
vi.mock('@xyflow/react', () => {
  return {
    ReactFlow: () => <div data-testid="mock-react-flow">ReactFlow</div>,
    useNodesState: (n: any) => [n, vi.fn(), vi.fn()],
    useEdgesState: (e: any) => [e, vi.fn(), vi.fn()],
    Controls: () => <div>Controls</div>,
    MiniMap: () => <div>MiniMap</div>,
    Background: () => <div>Background</div>,
    MarkerType: { ArrowClosed: 'ArrowClosed' }
  };
});

describe('App Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders the initial state correctly', () => {
    render(<App />);
    expect(screen.getByText('Mini Mindmap')).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/Paste an article/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Generate Mindmap/i })).toBeDisabled(); // Disabled because text is empty
  });

  it('enables the button when text is long enough', () => {
    render(<App />);
    const textarea = screen.getByPlaceholderText(/Paste an article/i);
    
    fireEvent.change(textarea, { target: { value: 'This is a sufficiently long test string for the input' } });
    expect(screen.getByRole('button', { name: /Generate Mindmap/i })).not.toBeDisabled();
  });

  it('shows error state when generation fails', async () => {
    mockedAxios.post.mockRejectedValueOnce({
      response: { data: { error: 'Invalid text provided' } }
    });

    render(<App />);
    const textarea = screen.getByPlaceholderText(/Paste an article/i);
    const button = screen.getByRole('button', { name: /Generate Mindmap/i });
    
    fireEvent.change(textarea, { target: { value: 'This is a sufficiently long test string for the input' } });
    fireEvent.click(button);

    await waitFor(() => {
      expect(screen.getByText('Invalid text provided')).toBeInTheDocument();
    });
  });

  it('renders graph on successful generation', async () => {
    mockedAxios.post.mockResolvedValueOnce({
      data: {
        title: 'Test Mindmap',
        rootId: '1',
        nodes: [{ id: '1', label: 'Root', summary: 'Root node' }],
        connections: []
      }
    });

    render(<App />);
    const textarea = screen.getByPlaceholderText(/Paste an article/i);
    const button = screen.getByRole('button', { name: /Generate Mindmap/i });
    
    fireEvent.change(textarea, { target: { value: 'This is a sufficiently long test string for the input' } });
    fireEvent.click(button);

    await waitFor(() => {
      expect(screen.getByTestId('mock-react-flow')).toBeInTheDocument();
    });
  });
});
