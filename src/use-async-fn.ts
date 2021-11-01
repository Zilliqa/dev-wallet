/**
 * Copyright (c) 2018 - present Zilliqa Research Pte. Ltd.
 *
 * This program is free software: you can redistribute it and/or modify it under the
 * terms of the GNU General Public License as published by the Free Software
 * Foundation, either version 3 of the License, or (at your option) any later
 * version.
 *
 * This program is distributed in the hope that it will be useful, but WITHOUT ANY
 * WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR
 * A PARTICULAR PURPOSE.  See the GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License along with
 * this program.  If not, see <http://www.gnu.org/licenses/>.
 */

import { useEffect, useReducer, useRef, useCallback } from 'react';

export enum statusTypes {
  Initial = 'Initial',
  Pending = 'Pending',
  Fulfilled = 'Fulfilled',
  Rejected = 'Rejected',
}

enum actionTypes {
  Init = 'Init',
  Run = 'Run',
  Abort = 'Abort',
  Fulfill = 'Fulfill',
  Reject = 'Reject',
}

interface Args {
  type: actionTypes;
  payload: any;
}

const getStatusProps = (status: statusTypes) => ({
  status,
  isInitial: status === statusTypes.Initial,
  isPending: status === statusTypes.Pending,
  isFulfilled: status === statusTypes.Fulfilled,
  isRejected: status === statusTypes.Rejected,
});

const initialize = () => ({
  data: undefined,
  error: undefined,
  ...getStatusProps(statusTypes.Initial),
});

const reducer = (state: any, args: Args) => {
  const { type, payload } = args;
  switch (type) {
    case actionTypes.Init:
      return initialize();
    case actionTypes.Run:
      return {
        ...state,
        data: undefined,
        error: undefined,
        ...getStatusProps(statusTypes.Pending),
      };
    case actionTypes.Fulfill:
      return {
        ...state,
        data: payload,
        error: undefined,
        ...getStatusProps(statusTypes.Fulfilled),
      };
    case actionTypes.Reject:
      return {
        ...state,
        data: undefined,
        error: payload,
        ...getStatusProps(statusTypes.Rejected),
      };
    case actionTypes.Abort:
      return {
        data: undefined,
        error: payload,
        ...getStatusProps(statusTypes.Rejected),
      };
  }
};

export interface UseAsyncFn {
  (...args: any[]): any;
}

export const useAsyncFn: UseAsyncFn = ({ fn, deferred = false, ...args }) => {
  const [state, dispatch] = useReducer(reducer, initialize());
  const asyncFn = fn;
  const isMountedRef = useRef(true);
  const abortControllerRef = useRef<AbortController>();
  const argsRef = useRef(args);
  const init = (): void => {
    isMountedRef.current && dispatch({ type: actionTypes.Init, payload: undefined });
  };

  const run = useCallback(
    async (newArgs?: any) => {
      if (newArgs) {
        argsRef.current = newArgs;
      }

      abortControllerRef.current = new AbortController();

      isMountedRef.current && dispatch({ type: actionTypes.Run, payload: undefined });
      try {
        const signal: AbortSignal | undefined =
          abortControllerRef.current && abortControllerRef.current.signal;
        const payload = await asyncFn({ args: argsRef.current, signal });
        isMountedRef.current && dispatch({ type: actionTypes.Fulfill, payload });
      } catch (error: any) {
        const curType =
          error && error.name === 'AbortError' ? actionTypes.Abort : actionTypes.Reject;

        isMountedRef.current && dispatch({ type: curType, payload: error });
      }
    },
    [asyncFn]
  );

  const abort = (): void => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
  };

  useEffect(
    () => () => {
      isMountedRef.current = false;
    },
    []
  );
  useEffect(() => {
    if (!deferred) {
      run();
    }
    return abort;
  }, [fn, run]);
  return { ...state, run, init, abort };
};
