export const isTestAddedToCart = (testCode, shoppingCart) => {
    if (!testCode) {
        return
    }
    if (!shoppingCart || !shoppingCart.shoppingCartItems || shoppingCart.shoppingCartItems.length == 0) {
        return false;
    }

    for (let index = 0; index < shoppingCart.shoppingCartItems.length; index++) {
        if (shoppingCart.shoppingCartItems[index].testCode.toUpperCase() == testCode.toUpperCase()) {
            return true;
        }
    }
    return false;
}