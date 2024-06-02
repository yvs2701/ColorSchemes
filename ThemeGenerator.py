from GAN import Generator
import torch


class ThemeGenerator:
    _base_colors: list[list[float]] = None
    _theme: list[str] = None

    def __init__(self, base_colors: list, isHex: bool = True):
        if isHex:
            self._base_colors = [self.hex_to_rgb(color) for color in base_colors]
        else:
            self._base_colors = base_colors
        print('Converted Base_Colors:', self._base_colors)
        self._theme = []

    def hex_to_rgb(self, hex: str) -> list[float]:
        if (hex[0] != '#'):
            hex = '#' + hex
        return [float(int(hex[i:i + 2], 16)) for i in (1, 3, 5)]

    def rgb_to_hex(self, r, g, b):
        return '#{:02x}{:02x}{:02x}'.format(r, g, b)

    def generate(self) -> list[str]:
        # Using GAN model to generate the theme.
        # Older implementation used simple color science and mathematical operations.
        model = Generator()
        model.load_state_dict(torch.load('./model/GeneratorV4'))
        model.eval()

        out = torch.round(model(torch.tensor([self._base_colors])).detach()).to(torch.int32)[0]

        for rgb in out:
            hex = self.rgb_to_hex(*rgb)
            self._theme.append(hex)
        print('Model output:', self._theme)
        return self._theme.copy()
