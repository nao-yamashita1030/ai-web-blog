import { render, screen, fireEvent } from '@testing-library/react';
import Pagination from '../Pagination';

describe('Pagination', () => {
  const mockOnPageChange = jest.fn();

  beforeEach(() => {
    mockOnPageChange.mockClear();
  });

  it('ページ番号が正しく表示される', () => {
    render(
      <Pagination currentPage={1} totalPages={5} onPageChange={mockOnPageChange} />
    );
    expect(screen.getByText('1')).toBeInTheDocument();
    expect(screen.getByText('2')).toBeInTheDocument();
    expect(screen.getByText('5')).toBeInTheDocument();
  });

  it('現在のページがハイライトされる', () => {
    render(
      <Pagination currentPage={3} totalPages={5} onPageChange={mockOnPageChange} />
    );
    const currentPageButton = screen.getByText('3');
    expect(currentPageButton).toHaveClass('bg-blue-500', 'text-white');
  });

  it('「前へ」ボタンが最初のページで無効になる', () => {
    render(
      <Pagination currentPage={1} totalPages={5} onPageChange={mockOnPageChange} />
    );
    const prevButton = screen.getByText('前へ');
    expect(prevButton).toBeDisabled();
  });

  it('「次へ」ボタンが最後のページで無効になる', () => {
    render(
      <Pagination currentPage={5} totalPages={5} onPageChange={mockOnPageChange} />
    );
    const nextButton = screen.getByText('次へ');
    expect(nextButton).toBeDisabled();
  });

  it('ページ番号をクリックするとonPageChangeが呼ばれる', () => {
    render(
      <Pagination currentPage={1} totalPages={5} onPageChange={mockOnPageChange} />
    );
    const page2Button = screen.getByText('2');
    fireEvent.click(page2Button);
    expect(mockOnPageChange).toHaveBeenCalledWith(2);
  });

  it('「前へ」ボタンをクリックすると前のページに移動する', () => {
    render(
      <Pagination currentPage={3} totalPages={5} onPageChange={mockOnPageChange} />
    );
    const prevButton = screen.getByText('前へ');
    fireEvent.click(prevButton);
    expect(mockOnPageChange).toHaveBeenCalledWith(2);
  });

  it('「次へ」ボタンをクリックすると次のページに移動する', () => {
    render(
      <Pagination currentPage={3} totalPages={5} onPageChange={mockOnPageChange} />
    );
    const nextButton = screen.getByText('次へ');
    fireEvent.click(nextButton);
    expect(mockOnPageChange).toHaveBeenCalledWith(4);
  });

  it('総ページ数が5以下の場合、すべてのページ番号が表示される', () => {
    render(
      <Pagination currentPage={1} totalPages={3} onPageChange={mockOnPageChange} />
    );
    expect(screen.getByText('1')).toBeInTheDocument();
    expect(screen.getByText('2')).toBeInTheDocument();
    expect(screen.getByText('3')).toBeInTheDocument();
    expect(screen.queryByText('...')).not.toBeInTheDocument();
  });

  it('総ページ数が5より大きい場合、省略記号が表示される', () => {
    render(
      <Pagination currentPage={1} totalPages={10} onPageChange={mockOnPageChange} />
    );
    expect(screen.getByText('...')).toBeInTheDocument();
  });

  it('現在のページが最初の方の場合、最初の4ページと最後のページが表示される', () => {
    render(
      <Pagination currentPage={2} totalPages={10} onPageChange={mockOnPageChange} />
    );
    expect(screen.getByText('1')).toBeInTheDocument();
    expect(screen.getByText('2')).toBeInTheDocument();
    expect(screen.getByText('3')).toBeInTheDocument();
    expect(screen.getByText('4')).toBeInTheDocument();
    expect(screen.getByText('10')).toBeInTheDocument();
  });

  it('現在のページが最後の方の場合、最初のページと最後の4ページが表示される', () => {
    render(
      <Pagination currentPage={9} totalPages={10} onPageChange={mockOnPageChange} />
    );
    expect(screen.getByText('1')).toBeInTheDocument();
    expect(screen.getByText('7')).toBeInTheDocument();
    expect(screen.getByText('8')).toBeInTheDocument();
    expect(screen.getByText('9')).toBeInTheDocument();
    expect(screen.getByText('10')).toBeInTheDocument();
  });

  it('現在のページが中間の場合、最初のページ、現在の前後1ページ、最後のページが表示される', () => {
    render(
      <Pagination currentPage={5} totalPages={10} onPageChange={mockOnPageChange} />
    );
    expect(screen.getByText('1')).toBeInTheDocument();
    expect(screen.getByText('4')).toBeInTheDocument();
    expect(screen.getByText('5')).toBeInTheDocument();
    expect(screen.getByText('6')).toBeInTheDocument();
    expect(screen.getByText('10')).toBeInTheDocument();
  });
});



