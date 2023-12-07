from flask import Flask, render_template, request, jsonify, abort
from DominantColors import DominantColors
from ThemeGenerator import ThemeGenerator
import numpy as np


app = Flask(__name__, static_url_path='',
            static_folder='static', template_folder='templates')


def rgb_to_hex(rgb: list[int]) -> str:
    return '#{:02x}{:02x}{:02x}'.format(rgb[0], rgb[1], rgb[2])

# TODO: ERROR HANDLING

@app.route('/api/extract_colors', methods=['POST'])
def extract_colors():
    # Thanks to: https://stackoverflow.com/a/48002503
    img = request.files['imgData'].read()
    data = np.frombuffer(img, np.uint8)

    dc = DominantColors(data)
    colors = dc.extractColors()
    hexcodes = []
    for _, swatch in enumerate(colors):
        hexcodes.append(rgb_to_hex(swatch))

    return jsonify({'hex_colors': hexcodes, 'rgb_colors': colors})


@app.route('/api/generate_colors', methods=['POST'])
def generate_colors():
    req = request.get_json()
    base_color = req['rgb_color']
    tg = ThemeGenerator(base_color=base_color, isRGB=True)
    theme = tg.generate()
    hexcodes = []
    for _, swatch in enumerate(theme):
        hexcodes.append(rgb_to_hex(swatch))

    return jsonify({'hex_colors': hexcodes, 'rgb_colors': theme})


@app.route('/')
def index():
    return render_template('index.html')


if __name__ == '__main__':
    app.run(debug=True, host='3000')
