import colorsys


class ThemeGenerator:
    _primary_color: list[int] = None
    _theme: list[list[int]] = None

    def __init__(self, base_color: list, isRGB: bool = True):
        if isRGB:
            h, l, s = colorsys.rgb_to_hls(
                base_color[0] / 255, base_color[1] / 255, base_color[2] / 255)
            self._primary_color = [
                round(h * 360), round(l * 100), round(s * 100)]
        else:
            self._primary_color = base_color
        self._theme = []

    def generate(self) -> list[list[int]]:
        # NOTE: FIND COMPLEMENTARY COLOR
        secondary_color: list[int] = [0, 0, 0]
        if self._primary_color[0] < 180:
            secondary_color[0] = 180 + self._primary_color[0]
        else:
            secondary_color[0] = self._primary_color[0] - 180

        # reducing brightness by 25%
        secondary_color[1] = round(self._primary_color[1] * 0.75)

        # reducing saturation by 30%
        secondary_color[2] = round(self._primary_color[2] * 0.7)

        # NOTE: FIND COLOR TINTS
        primary_tint = self._primary_color.copy()
        secondary_tint = secondary_color.copy()

        # brightening by 75%
        primary_tint[1] = round(primary_tint[1] * 1.75)
        secondary_tint[1] = round(secondary_tint[1] * 1.75)

        # adjusting brightness if out of range
        if primary_tint[1] > 100:
            primary_tint[1] = 100
        if secondary_tint[1] > 100:
            secondary_tint[1] = 100

        # desaturating by 75%
        primary_tint[2] = round(primary_tint[2] * 0.25)
        secondary_tint[2] = round(secondary_tint[2] * 0.25)

        # NOTE: FIND COLOR SHADOWS
        primary_shadow = self._primary_color.copy()
        secondary_shadow = secondary_color.copy()

        # reducing brightness by 50%
        primary_shadow[1] = round(primary_shadow[1] * 0.5)
        secondary_shadow[1] = round(secondary_shadow[1] * 0.5)

        # shifting hue towards blue (HUE = 240 deg) by 20 points
        if primary_shadow[0] > 240:
            primary_shadow[0] -= 20
        else:
            primary_shadow[0] += 20
        if secondary_shadow[0] > 240:
            secondary_shadow[0] -= 20
        else:
            secondary_shadow[0] += 20
        
        # adjusting hue if out of range
        if primary_shadow[0] < 0:
            primary_shadow[0] = 360 + primary_shadow[0]
        elif primary_shadow[0] > 360:
            primary_shadow[0] = primary_shadow[0] - 360 
        if secondary_shadow[0] < 0:
            secondary_shadow[0] = 360 + secondary_shadow[0]
        elif secondary_shadow[0] > 360:
            secondary_shadow[0] = secondary_shadow[0] - 360

        # increasing saturation by 20%
        primary_shadow[2] = round(primary_shadow[2] * 1.2)
        secondary_shadow[2] = round(secondary_shadow[2] * 1.2)

        # adjusting saturation if out of range
        if primary_shadow[2] > 100:
            primary_shadow[2] = 100
        if secondary_shadow[2] > 100:
            secondary_shadow[2] = 100

        # Complete theme: [primary, secondary, primary_tint, secondary_tint, primary_shadow, secondary_shadow]
        self._theme = [
            self._primary_color, secondary_color,
            primary_tint, secondary_tint,
            primary_shadow, secondary_shadow
        ]

        # NOTE: COLORSPACE CONVERSION
        for idx, swatch in enumerate(self._theme):
            r, g, b = colorsys.hls_to_rgb(
                swatch[0]/360, swatch[1]/100, swatch[2]/100)
            self._theme[idx] = [round(r * 255), round(g * 255), round(b * 255)]

        return self._theme
