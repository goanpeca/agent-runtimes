/*
 * Copyright (c) 2025-2026 Datalayer, Inc.
 * Distributed under the terms of the Modified BSD License.
 */

import { describe, it, expect, vi } from 'vitest';
import { renderHook } from '@testing-library/react';
import * as React from 'react';
import type { ReactNode } from 'react';

import {
  AgentRuntimesClientProvider,
  useAgentRuntimesClient,
  useOptionalAgentRuntimesClient,
} from './AgentRuntimesClientContext';
import type { IAgentRuntimesClient } from './IAgentRuntimesClient';

function makeClient(): IAgentRuntimesClient {
  return {
    listRunningAgents: vi.fn().mockResolvedValue([]),
    getAgentStatus: vi.fn(),
    pauseAgent: vi.fn(),
    resumeAgent: vi.fn(),
    getAgentCheckpoints: vi.fn(),
    getAgentUsage: vi.fn(),
    listNotifications: vi.fn(),
    markNotificationRead: vi.fn(),
    markAllNotificationsRead: vi.fn(),
    createEvent: vi.fn(),
    listEvents: vi.fn(),
    getEvent: vi.fn(),
    updateEvent: vi.fn(),
    getAgentOutputs: vi.fn(),
    getAgentOutput: vi.fn(),
    generateAgentOutput: vi.fn(),
    runEvals: vi.fn(),
    listEvals: vi.fn(),
    getEval: vi.fn(),
    getContextUsage: vi.fn(),
    getCostUsage: vi.fn(),
    createAgentRuntime: vi.fn(),
  } as unknown as IAgentRuntimesClient;
}

describe('useAgentRuntimesClient', () => {
  it('throws a descriptive error when used outside a provider', () => {
    // React logs the rendering error to console.error when a component throws
    // during render; silence it for this test so the expected throw doesn't
    // pollute test output.
    const spy = vi.spyOn(console, 'error').mockImplementation(() => {});
    try {
      expect(() => renderHook(() => useAgentRuntimesClient())).toThrow(
        /useAgentRuntimesClient must be called inside an <AgentRuntimesClientProvider>/,
      );
    } finally {
      spy.mockRestore();
    }
  });

  it('returns the provided client when wrapped in a provider', () => {
    const client = makeClient();
    const wrapper = ({ children }: { children: ReactNode }) => (
      <AgentRuntimesClientProvider client={client}>
        {children}
      </AgentRuntimesClientProvider>
    );
    const { result } = renderHook(() => useAgentRuntimesClient(), { wrapper });
    expect(result.current).toBe(client);
  });

  it('returns the new client when the provider value changes', () => {
    const clientA = makeClient();
    const clientB = makeClient();
    let activeClient: IAgentRuntimesClient = clientA;
    const wrapper = ({ children }: { children: ReactNode }) => (
      <AgentRuntimesClientProvider client={activeClient}>
        {children}
      </AgentRuntimesClientProvider>
    );
    const { result, rerender } = renderHook(() => useAgentRuntimesClient(), {
      wrapper,
    });
    expect(result.current).toBe(clientA);
    activeClient = clientB;
    rerender();
    expect(result.current).toBe(clientB);
  });
});

describe('useOptionalAgentRuntimesClient', () => {
  it('returns null outside a provider', () => {
    const { result } = renderHook(() => useOptionalAgentRuntimesClient());
    expect(result.current).toBeNull();
  });

  it('returns the client inside a provider', () => {
    const client = makeClient();
    const wrapper = ({ children }: { children: ReactNode }) => (
      <AgentRuntimesClientProvider client={client}>
        {children}
      </AgentRuntimesClientProvider>
    );
    const { result } = renderHook(() => useOptionalAgentRuntimesClient(), {
      wrapper,
    });
    expect(result.current).toBe(client);
  });
});
