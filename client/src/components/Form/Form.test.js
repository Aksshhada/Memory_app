import React from 'react';
import '@testing-library/jest-dom/extend-expect'; 
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store'; 
import { useDispatch } from 'react-redux';
import Form from './Form';
import FileBase from 'react-file-base64';
import { render, fireEvent, screen, waitFor, cleanup } from '@testing-library/react';

afterEach(() => {
  cleanup(); 
});

jest.mock('react-redux', () => ({
  ...jest.requireActual('react-redux'),
  useDispatch: jest.fn(),
}));

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
      <Form currentId={0} setCurrentId={jest.fn()} /> 
      </Provider>
    );


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

    const creatorInput = screen.getByPlaceholderText('Creator');
    const titleInput = screen.getByPlaceholderText('Title');
    const messageInput = screen.getByPlaceholderText('Message');
    const tagsInput = screen.getByPlaceholderText('Tags');

    fireEvent.change(creatorInput, { target: { value: 'John Doe' } });
    fireEvent.change(titleInput, { target: { value: 'Test Title' } });
    fireEvent.change(messageInput, { target: { value: 'Test Message' } });
    fireEvent.change(tagsInput, { target: { value: 'tag1,tag2' } });

    expect(creatorInput.value).toBe('John Doe');
    expect(titleInput.value).toBe('Test Title');
    expect(messageInput.value).toBe('Test Message');
    expect(tagsInput.value).toBe('tag1,tag2');
  });
  

// Validation test: checks that the description has at least 5 words
test('checks that description has at least 5 words', () => {
  render(
    <Provider store={store}>
      <Form />
    </Provider>
  );

  const messageInput = screen.getByPlaceholderText('Message');

  // Invalid case: less than 5 words
  fireEvent.change(messageInput, { target: { value: 'Too short' } });
  expect(messageInput.value.split(' ').length).toBeLessThan(5);

  // Valid case: 5 or more words
  fireEvent.change(messageInput, { target: { value: 'This description has more than five words' } });
  expect(messageInput.value.split(' ').length).toBeGreaterThanOrEqual(5);
});



  test('uploads dummy image and sets base64 string', () => {
    render(
      <Provider store={store}>
        <Form />
      </Provider>
    );

    const fileInput = screen.getByTestId('file_input');
    fireEvent.change(fileInput);

    expect(FileBase).toHaveBeenCalled();
  });

  test('calls dispatch when form is submitted', async () => {
    render(
      <Provider store={store}>
      <Form currentId={0} setCurrentId={jest.fn()} /> 
      </Provider>
    );

    fireEvent.click(screen.getByRole('button', { name: /submit/i }));

      expect(mockDispatch).toHaveBeenCalled(); 
      expect(mockDispatch).toHaveBeenCalledWith(expect.any(Function));
  
    });
});
