"use server";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import { addToCart, removeFromCart, updateCart } from "@/lib/bagisto";
import { SuperAttribute } from "@/lib/bagisto/types";
import { BAGISTO_SESSION, TAGS } from "@/lib/constants";
export async function addItem(
  prevState: any,
  input: {
    quantity: number;
    selectedVariantId: string;
    selectedConfigurableOption?: number;
    superAttribute?: SuperAttribute[];
    isBuyNow?: boolean;
  }
) {
  const cookieStore = await cookies();
  const cartId = cookieStore.get(BAGISTO_SESSION)?.value;

  if (!cartId) {
    //   await getCart();
    // } else {
    cookieStore.set(BAGISTO_SESSION, generateCookieValue(40), {
      httpOnly: true,
      secure: false,
    });
  }

  if (!input.selectedVariantId) {
    return "Missing product variant ID";
  }

  const selectedConfigurableOption = input.selectedConfigurableOption;

  try {
    await addToCart({
      productId: Number(input?.selectedVariantId),
      quantity: input.quantity,
      isBuyNow: input.isBuyNow || false,
      selectedConfigurableOption,
      superAttribute: input.superAttribute ?? [],
    });
    revalidatePath("/");
  } catch (e) {
    return "Error adding item to cart";
  }
}

function generateCookieValue(length: number) {
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let cookieValue = "";

  for (let i = 0; i < length; i++) {
    cookieValue += characters.charAt(
      Math.floor(Math.random() * characters.length)
    );
  }

  return cookieValue;
}

export async function removeItem(prevState: any, lineId: number) {
  const cookieStore = await cookies();
  const cartId = cookieStore.get(BAGISTO_SESSION)?.value;

  if (!cartId) {
    return "Missing cart ID";
  }

  try {
    await removeFromCart(Number(lineId));
    revalidatePath("/");
  } catch (e) {
    return "Error removing item from cart";
  }
}

export async function updateItemQuantity(
  prevState: any,
  payload: {
    lineId: number;
    quantity: number;
  }
) {
  const cookieStore = await cookies();
  const cartId = cookieStore.get(BAGISTO_SESSION)?.value;

  if (!cartId) {
    return "Missing cart ID";
  }

  const { lineId, quantity } = payload;

  try {
    if (quantity === 0) {
      await removeFromCart(Number(lineId));
      revalidatePath("/");

      return;
    }

    await updateCart([
      {
        cartItemId: lineId,
        quantity,
      },
    ]);
    revalidatePath("/");
  } catch (e) {
    return "Error updating item quantity";
  }
}

export async function redirectToCheckout(formData: FormData) {
  const url = formData.get("url") as string;

  redirect(url);
}
