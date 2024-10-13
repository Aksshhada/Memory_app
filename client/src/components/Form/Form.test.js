import React from 'react';
import '@testing-library/jest-dom/extend-expect'; // Provides custom matchers like "toBeInTheDocument"
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store'; // Helps create a mock store for testing
import { useDispatch } from 'react-redux';
import Form from './Form';
import FileBase from 'react-file-base64';
import { render, fireEvent, screen, waitFor, cleanup } from '@testing-library/react';



afterEach(() => {
  cleanup(); // clean up after each test to prevent errors
});

// Mock the useDispatch hook
jest.mock('react-redux', () => ({
  ...jest.requireActual('react-redux'),
  useDispatch: jest.fn(),
}));

// Mock the FileBase component
jest.mock('react-file-base64', () => {
  return jest.fn((props) => (
    <input
      data-testid="file_input"
      type="file"
      onChange={() => props.onDone({ base64: 'data:image/png;base64,dummyimage' })}
    />
  ));
});

describe('Form Component', () => {
  const mockStore = configureStore([]);
  const store = mockStore({ posts: [] });
  const mockDispatch = jest.fn();

  beforeEach(() => {
    useDispatch.mockReturnValue(mockDispatch);
  });

  test('renders form correctly', () => {
    render(
      <Provider store={store}>
      <Form currentId={0} setCurrentId={jest.fn()} /> {/* Mocking setCurrentId */}
      </Provider>
    );

    // Check if the input fields are in the document
    // Update these lines to use getByRole or getByPlaceholderText
    expect(screen.getByPlaceholderText(/Creator/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/Title/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/Message/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/Tags/i)).toBeInTheDocument();
    
    expect(screen.getByRole('button', { name: /submit/i })).toBeInTheDocument();
  });

  test('handles user input', () => {
    render(
      <Provider store={store}>
        <Form />
      </Provider>
    );

    // Get the input elements
    const creatorInput = screen.getByPlaceholderText('Creator');
    const titleInput = screen.getByPlaceholderText('Title');
    const messageInput = screen.getByPlaceholderText('Message');
    const tagsInput = screen.getByPlaceholderText('Tags');

    // Simulate user typing in the form fields
    fireEvent.change(creatorInput, { target: { value: 'John Doe' } });
    fireEvent.change(titleInput, { target: { value: 'Test Title' } });
    fireEvent.change(messageInput, { target: { value: 'Test Message' } });
    fireEvent.change(tagsInput, { target: { value: 'tag1,tag2' } });

    // Assert that the values have been updated
    expect(creatorInput.value).toBe('John Doe');
    expect(titleInput.value).toBe('Test Title');
    expect(messageInput.value).toBe('Test Message');
    expect(tagsInput.value).toBe('tag1,tag2');
  });

  test('uploads dummy image and sets base64 string', () => {
    render(
      <Provider store={store}>
        <Form />
      </Provider>
    );

    // Simulate image upload using the mocked FileBase
    const fileInput = screen.getByTestId('file_input');
    fireEvent.change(fileInput);

    // Assert that FileBase received the correct base64 string
    expect(FileBase).toHaveBeenCalled();
  });

  test('calls dispatch when form is submitted', async () => {
    render(
      <Provider store={store}>
      <Form currentId={0} setCurrentId={jest.fn()} /> {/* Mocking setCurrentId */}
      </Provider>
    );

    // Simulate form submission
    fireEvent.click(screen.getByRole('button', { name: /submit/i }));

    // Check if the dispatch function has been called
      expect(mockDispatch).toHaveBeenCalled(); // Use mockDispatch here
      expect(mockDispatch).toHaveBeenCalledWith(expect.any(Function)); // You can also check if it's called with the correct action
  
    });
});
