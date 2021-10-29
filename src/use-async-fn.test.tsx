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

import { useAsyncFn } from './use-async-fn';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import 'whatwg-fetch';

const Sample = ({ fn, deferred }: any) => {
  const { run, init, abort, isInitial, isPending, data, isFulfilled, isRejected, error } =
    useAsyncFn({ fn, deferred, x: 'current' });

  return (
    <>
      <div data-testid="is-initial">{isInitial ? 'true' : 'false'}</div>
      <div data-testid="is-pending">{isPending ? 'true' : 'false'}</div>
      <div data-testid="is-fulfilled">{isFulfilled ? 'true' : 'false'}</div>
      <div data-testid="is-rejected">{isRejected ? 'true' : 'false'}</div>
      <div data-testid="data">{JSON.stringify(data)}</div>
      <div data-testid="error">{error && error.name}</div>
      <button data-testid="run-with-current-args" onClick={() => run()} />
      <button data-testid="run-with-new-args" onClick={() => run({ x: 'new' })} />
      <button data-testid="init" onClick={() => init()} />
      <button data-testid="abort" onClick={() => abort()} />
    </>
  );
};

const expectInitial = (screen: any) => {
  expect(screen.getByTestId('is-initial')).toHaveTextContent('true');
  expect(screen.getByTestId('is-pending')).toHaveTextContent('false');
  expect(screen.getByTestId('is-fulfilled')).toHaveTextContent('false');
  expect(screen.getByTestId('is-rejected')).toHaveTextContent('false');
  expect(screen.getByTestId('data')).toHaveTextContent(``);
  expect(screen.getByTestId('error')).toHaveTextContent(``);
};
const expectPending = (screen: any) => {
  expect(screen.getByTestId('is-initial')).toHaveTextContent('false');
  expect(screen.getByTestId('is-pending')).toHaveTextContent('true');
  expect(screen.getByTestId('is-fulfilled')).toHaveTextContent('false');
  expect(screen.getByTestId('is-rejected')).toHaveTextContent('false');
  expect(screen.getByTestId('data')).toHaveTextContent(``);
  expect(screen.getByTestId('error')).toHaveTextContent(``);
};
const expectFulfilledWithData = (screen: any, data: string) => {
  expect(screen.getByTestId('is-initial')).toHaveTextContent('false');
  expect(screen.getByTestId('is-pending')).toHaveTextContent('false');
  expect(screen.getByTestId('is-fulfilled')).toHaveTextContent('true');
  expect(screen.getByTestId('is-rejected')).toHaveTextContent('false');
  expect(screen.getByTestId('data')).toHaveTextContent(data);
  expect(screen.getByTestId('error')).toHaveTextContent(``);
};
const expectRejected = (screen: any) => {
  expect(screen.getByTestId('is-initial')).toHaveTextContent('false');
  expect(screen.getByTestId('is-pending')).toHaveTextContent('false');
  expect(screen.getByTestId('is-fulfilled')).toHaveTextContent('false');
  expect(screen.getByTestId('is-rejected')).toHaveTextContent('true');
  expect(screen.getByTestId('data')).toHaveTextContent(``);
  expect(screen.getByTestId('error')).toHaveTextContent('Error');
};
const expectAborted = (screen: any) => {
  expect(screen.getByTestId('is-initial')).toHaveTextContent('false');
  expect(screen.getByTestId('is-pending')).toHaveTextContent('false');
  expect(screen.getByTestId('is-fulfilled')).toHaveTextContent('false');
  expect(screen.getByTestId('is-rejected')).toHaveTextContent('true');
  expect(screen.getByTestId('data')).toHaveTextContent(``);
  expect(screen.getByTestId('error')).toHaveTextContent('AbortError');
};

test('run promise with resolved value', async () => {
  const fn = jest.fn().mockResolvedValue({ statusCode: 200 });
  render(<Sample fn={fn} />);
  expect(fn).toHaveBeenCalledWith({
    args: { x: 'current' },
    signal: new AbortController().signal,
  });
  expectPending(screen);
  await waitFor(() => expectFulfilledWithData(screen, `{"statusCode":200}`));
});

test('run promise with new args', async () => {
  const fn = jest.fn().mockResolvedValue({ statusCode: 200 });
  render(<Sample fn={fn} />);

  expect(fn).toHaveBeenCalledWith({
    args: { x: 'current' },
    signal: new AbortController().signal,
  });
  expectPending(screen);
  await waitFor(() => expectFulfilledWithData(screen, `{"statusCode":200}`));

  await fireEvent.click(screen.getByTestId('run-with-new-args'));
  expect(fn.mock.calls[fn.mock.calls.length - 1]).toEqual([
    {
      args: { x: 'new' },
      signal: new AbortController().signal,
    },
  ]);

  expectPending(screen);
  await waitFor(() => expectFulfilledWithData(screen, `{"statusCode":200}`));
});

test('run promise with rejected value', async () => {
  const fn = jest.fn().mockRejectedValue(new Error());
  render(<Sample fn={fn} />);
  expect(fn).toHaveBeenCalledWith({
    args: { x: 'current' },
    signal: new AbortController().signal,
  });
  expectPending(screen);
  await waitFor(() => expectRejected(screen));
});

test('run promise and abort', async () => {
  const fn = async ({ signal }: any) =>
    await fetch(`https://www.google.com/`, {
      signal,
      method: 'GET',
    });
  render(<Sample fn={fn} />);
  expectPending(screen);
  await fireEvent.click(screen.getByTestId('abort'));
  await waitFor(() => expectAborted(screen));
});

test('run promise and init', async () => {
  const fn = jest.fn().mockResolvedValue({ statusCode: 200 });
  render(<Sample fn={fn} />);
  expectPending(screen);
  await fireEvent.click(screen.getByTestId('init'));
  await waitFor(() => expectInitial(screen));
});

test('run defer fn with resolved value', async () => {
  const fn = jest.fn().mockResolvedValue({ statusCode: 200 });
  render(<Sample fn={fn} deferred={true} />);
  expect(fn).not.toHaveBeenCalled();
  expectInitial(screen);
  await fireEvent.click(screen.getByTestId('run-with-current-args'));
  expect(fn).toHaveBeenCalledWith({
    args: { x: 'current' },
    signal: new AbortController().signal,
  });
  expectPending(screen);
  await waitFor(() => screen.getByTestId('data'));
  expectFulfilledWithData(screen, `{"statusCode":200}`);
});

test('run defer fn with rejected value', async () => {
  const fn = jest.fn().mockRejectedValue(new Error());
  render(<Sample fn={fn} deferred={true} />);
  expect(fn).not.toHaveBeenCalled();
  expectInitial(screen);
  await fireEvent.click(screen.getByTestId('run-with-current-args'));
  expect(fn).toHaveBeenCalledWith({
    args: { x: 'current' },
    signal: new AbortController().signal,
  });
  expectPending(screen);
  await waitFor(() => expectRejected(screen));
});

test('run defer fn with new args', async () => {
  const fn = jest.fn().mockResolvedValue({ statusCode: 200 });
  render(<Sample fn={fn} deferred={true} />);

  expect(fn).not.toHaveBeenCalled();

  expectInitial(screen);

  await fireEvent.click(screen.getByTestId('run-with-new-args'));

  expect(fn).toHaveBeenCalledWith({
    args: { x: 'new' },
    signal: new AbortController().signal,
  });

  expectPending(screen);
  await waitFor(() => expectFulfilledWithData(screen, `{"statusCode":200}`));

  expect(fn).toHaveBeenCalledWith({
    args: { x: 'new' },
    signal: new AbortController().signal,
  });
});

test('run defer fn and abort', async () => {
  const fn = async ({ signal }: any) =>
    await fetch(`https://www.google.com/`, {
      signal,
      method: 'GET',
    });
  render(<Sample fn={fn} deferred={true} />);
  expectInitial(screen);

  await fireEvent.click(screen.getByTestId('run-with-current-args'));
  await waitFor(() => expectPending(screen));

  await fireEvent.click(screen.getByTestId('abort'));
  await waitFor(() => expectAborted(screen));
});

test('run defer fn and init', async () => {
  const fn = jest.fn().mockResolvedValue({ statusCode: 200 });
  render(<Sample fn={fn} deferred={true} />);
  expect(fn).not.toHaveBeenCalled();
  expectInitial(screen);

  await fireEvent.click(screen.getByTestId('run-with-current-args'));
  await waitFor(() => expectPending(screen));

  await fireEvent.click(screen.getByTestId('init'));
  await waitFor(() => expectInitial(screen));
});
