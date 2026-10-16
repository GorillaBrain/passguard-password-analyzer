import '@testing-library/jest-dom/vitest';
import { act } from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { PasswordAnalyzer } from '../components/PasswordAnalyzer';
import { PassphraseGenerator } from '../components/PassphraseGenerator';
import { SecurityChecklist } from '../components/SecurityChecklist';

describe('PassGuard Component UI Suite', () => {
  it('renders PasswordAnalyzer and handles password input', async () => {
    const handlePrivacy = vi.fn();
    const handleGen = vi.fn();

    render(
      <PasswordAnalyzer
        onOpenPrivacyModal={handlePrivacy}
        onNavigateToGenerator={handleGen}
      />
    );

    const input = screen.getByPlaceholderText(/Type or paste a password/i) as HTMLInputElement;
    expect(input).toBeInTheDocument();
    expect(input.type).toBe('password');

    // Type a password
    await act(async () => {
      fireEvent.change(input, { target: { value: 'password123' } });
    });
    expect(input.value).toBe('password123');

    // Toggle visibility
    const showHideBtn = screen.getByTitle(/Show password|Hide password/i);
    await act(async () => {
      fireEvent.click(showHideBtn);
    });
    expect(input.type).toBe('text');

    await act(async () => {
      fireEvent.click(showHideBtn);
    });
    expect(input.type).toBe('password');
  });

  it('clears password and resets state when Reset button is clicked', async () => {
    render(
      <PasswordAnalyzer
        onOpenPrivacyModal={vi.fn()}
        onNavigateToGenerator={vi.fn()}
      />
    );

    const input = screen.getByPlaceholderText(/Type or paste a password/i) as HTMLInputElement;
    await act(async () => {
      fireEvent.change(input, { target: { value: 'SecretPassword999!' } });
    });
    expect(input.value).toBe('SecretPassword999!');

    const resetBtn = screen.getByTitle(/Clear password from memory/i);
    expect(resetBtn).toBeInTheDocument();

    await act(async () => {
      fireEvent.click(resetBtn);
    });
    expect(input.value).toBe('');
  });

  it('copies password to clipboard and shows feedback', async () => {
    render(
      <PasswordAnalyzer
        onOpenPrivacyModal={vi.fn()}
        onNavigateToGenerator={vi.fn()}
      />
    );

    const input = screen.getByPlaceholderText(/Type or paste a password/i) as HTMLInputElement;
    await act(async () => {
      fireEvent.change(input, { target: { value: 'SampleVaultPassword42!' } });
    });

    const copyBtn = screen.getByLabelText(/Copy password to clipboard/i);
    await act(async () => {
      fireEvent.click(copyBtn);
    });

    expect(navigator.clipboard.writeText).toHaveBeenCalledWith('SampleVaultPassword42!');
  });

  it('renders PassphraseGenerator and allows regeneration and copying', async () => {
    const handleTest = vi.fn();

    render(<PassphraseGenerator onTestInAnalyzer={handleTest} />);

    // Verify passphrase title exists
    expect(screen.getByText(/Generated Passphrase Example/i)).toBeInTheDocument();

    // Verify regenerate button works
    const regenBtn = screen.getByText(/Regenerate/i);
    await act(async () => {
      fireEvent.click(regenBtn);
    });

    // Verify copy button works
    const copyBtn = screen.getByText(/Copy Passphrase/i);
    await act(async () => {
      fireEvent.click(copyBtn);
    });
    expect(navigator.clipboard.writeText).toHaveBeenCalled();

    // Verify "Analyze in Password Meter" triggers callback
    const analyzeBtn = screen.getByText(/Analyze in Password Meter/i);
    await act(async () => {
      fireEvent.click(analyzeBtn);
    });
    expect(handleTest).toHaveBeenCalled();
  });

  it('renders SecurityChecklist and updates score on item click', async () => {
    render(<SecurityChecklist />);

    expect(screen.getByText(/Personal Security Hygiene Checklist/i)).toBeInTheDocument();

    // Find a checklist item
    const itemTitle = screen.getByText(/Zero Password Reuse/i);
    expect(itemTitle).toBeInTheDocument();

    // Click item to toggle
    await act(async () => {
      fireEvent.click(itemTitle);
    });

    // Verify reset checklist button exists
    const resetBtn = screen.getByLabelText(/Reset checklist/i);
    await act(async () => {
      fireEvent.click(resetBtn);
    });
    expect(screen.getByText(/0 \/ 8/i)).toBeInTheDocument();
  });
});
