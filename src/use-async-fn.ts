import { useEffect, useReducer, useRef, useCallback } from 'react';

/* tslint:disable */

export enum statusTypes {
    Initial = 'Initial',
    Pending = 'Pending',
    Fulfilled = 'Fulfilled',
    Rejected = 'Rejected'
}

enum actionTypes {
    Init = 'Init',
    Run = 'Run',
    Abort = 'Abort',
    Fulfill = 'Fulfill',
    Reject = 'Reject'
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
    isRejected: status === statusTypes.Rejected
});

const initialize = () => ({
    data: undefined,
    error: undefined,
    ...getStatusProps(statusTypes.Initial)
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
                ...getStatusProps(statusTypes.Pending)
            };
        case actionTypes.Fulfill:
            return {
                ...state,
                data: payload,
                error: undefined,
                ...getStatusProps(statusTypes.Fulfilled)
            };
        case actionTypes.Reject:
            return {
                ...state,
                data: undefined,
                error: payload,
                ...getStatusProps(statusTypes.Rejected)
            };
        case actionTypes.Abort:
            return {
                data: undefined,
                error: payload,
                ...getStatusProps(statusTypes.Rejected)
            };
        default:
            return state;
    }
};

export interface UseAsyncFn {
    (...args: any[]): any;
}

export const useAsyncFn: UseAsyncFn = ({ promiseFn, deferFn, ...args }) => {
    const [state, dispatch] = useReducer(reducer, initialize());
    const asyncFn = promiseFn || deferFn;
    if (asyncFn === undefined) {
        throw new Error('either promiseFn or deferFn should be provided');
    }

    const isMountedRef = useRef(true);
    const abortControllerRef = useRef<AbortController | undefined>();
    const argsRef = useRef(args);
    const init = (): void => {
        isMountedRef.current && dispatch({ type: actionTypes.Init, payload: undefined });
    };

    const run = useCallback(
        async (newArgs?: any) => {
            if (newArgs) {
                argsRef.current = newArgs;
            }
            if (AbortController) {
                abortControllerRef.current = new AbortController();
            }
            isMountedRef.current && dispatch({ type: actionTypes.Run, payload: undefined });
            try {
                const signal: AbortSignal | undefined =
                    abortControllerRef.current && abortControllerRef.current.signal;
                if (signal && signal.aborted) {
                    throw new DOMException();
                }
                const payload = await asyncFn({ args: argsRef.current, signal });
                isMountedRef.current && dispatch({ type: actionTypes.Fulfill, payload });
            } catch (error) {
                if (error.name === 'AbortError') {
                    isMountedRef.current && dispatch({ type: actionTypes.Abort, payload: error });
                } else {
                    isMountedRef.current && dispatch({ type: actionTypes.Reject, payload: error });
                }
            }
        },
        [asyncFn]
    );

    const cancel = (): void => {
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
        if (promiseFn) {
            run();
        }
        return cancel;
    }, [promiseFn, run]);
    return { ...state, run, init, cancel };
};