from DominantColors import DominantColors
from ThemeGenerator import ThemeGenerator

def rgb_to_hex(rgb: list[int]) -> str:
    return '#{:02x}{:02x}{:02x}'.format(rgb[0], rgb[1], rgb[2])

if __name__ == '__main__':
    imgPath = 'static/samples/3.jpg'
    dc = DominantColors(imgPath)
    colors = dc.extractColors()
    print(colors)
    tg = ThemeGenerator(colors[-1])
    theme = tg.generate()
    print(theme)

    # NOTE: CONVERT TO HEXCODE
    for idx, swatch in enumerate(theme):
        theme[idx] = rgb_to_hex(swatch)
    print(theme)
