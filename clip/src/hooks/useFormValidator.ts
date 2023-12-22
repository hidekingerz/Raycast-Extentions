import { useCallback, useState } from "react";
import { Form } from "@raycast/api";

type useFormValidator = {
  urlError: string | undefined;
  dropUrlErrorIfNeeded: () => void;
  handleUrlOnBlur: (event: Form.Event<string>) => void;
  bodyError: string | undefined;
  dropBodyErrorIfNeeded: () => void;
  handleBodyOnBlur: (event: Form.Event<string>) => void;
};

export const useFormValidator = (): useFormValidator => {
  const [urlError, setUrlError] = useState<string | undefined>();
  /**
   * URLが条件を満たしたら、urlErrorにundefinedをセットする
   * @type {() => void}
   */
  const dropUrlErrorIfNeeded: () => void = useCallback((): void => {
    if (urlError && urlError.length > 0) {
      setUrlError(undefined);
    }
  }, [urlError]);

  /**
   * URLフィールド用 onBlurハンドラ
   *  - 入力値が0またはvalueがundefinedの場合：指定のエラーをurlErrorにセットする。
   *   - 上記以外の場合：dropUrlErrorIfNeeded() を実行する。
   * @type {(event: Form.Event<string>) => void}
   */
  const handleUrlOnBlur: (event: Form.Event<string>) => void = useCallback(
    (event: Form.Event<string>) => {
      if (event.target.value?.length == 0) {
        setUrlError("The field shouldn't be empty!");
      } else {
        dropUrlErrorIfNeeded();
      }
    },
    [setUrlError, dropUrlErrorIfNeeded],
  );

  const [bodyError, setBodyError] = useState<string | undefined>();
  /**
   * Bodyが条件を満たしたら、bodyErrorにundefinedをセットする
   * @type {() => void}
   */
  const dropBodyErrorIfNeeded: () => void = useCallback((): void => {
    if (bodyError && bodyError.length > 0) {
      setBodyError(undefined);
    }
  }, [bodyError]);

  /**
   * Bodyフィールド用 onBlurハンドラ。
   *   - 入力値が0またはvalueがundefinedの場合：指定のエラーをbodyErrorにセットする。
   *   - 上記以外の場合：dropBodyErrorIfNeeded() を実行する。
   * @type {(event: Form.Event<string>) => void}
   */
  const handleBodyOnBlur: (event: Form.Event<string>) => void = useCallback(
    (event: Form.Event<string>): void => {
      if (event.target.value?.length == 0) {
        setBodyError("The field shouldn't be empty!");
      } else {
        dropBodyErrorIfNeeded();
      }
    },
    [setBodyError, dropBodyErrorIfNeeded],
  );

  return {
    urlError,
    dropUrlErrorIfNeeded,
    handleUrlOnBlur,
    bodyError,
    dropBodyErrorIfNeeded,
    handleBodyOnBlur,
  };
};
