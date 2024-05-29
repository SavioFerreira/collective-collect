type SignOutFunction = () => void;

let signOutCallback: SignOutFunction = () => {};

export const setSignOutCallback = (callback: SignOutFunction) => {
  signOutCallback = callback;
};

export const performSignOut = (): void => {
  signOutCallback();
};
