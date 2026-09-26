from fastapi import Header

def get_locale(
    accept_language: str = Header(default="en-US", alias="Accept-Language"),
    x_hospyar_locale: str = Header(default="", alias="X-Hospyar-Locale")
) -> dict:
    locale = x_hospyar_locale or accept_language or "en-US"
    is_rtl = "ar" in locale.lower()
    return {
        "locale": locale,
        "is_rtl": is_rtl,
        "direction": "rtl" if is_rtl else "ltr"
    }
