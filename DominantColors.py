import cv2
import math
from sklearn.cluster import KMeans


class DominantColors:

    CLUSTERS: int = None
    MAX_DIM: int = None
    _IMG_PATH: str = None
    _image = None
    _colors = None
    _labels = None

    def __init__(self, image: str, clusters: int = 7, max_dim: int = 500):
        self.CLUSTERS = clusters
        self.MAX_DIM = max_dim
        self._IMG_PATH = image

    def extractColors(self) -> list[list[int]]:
        img = cv2.imdecode(self._IMG_PATH, cv2.IMREAD_UNCHANGED)

        # NOTE: Downscale/resize image
        # image dimensions order: Height, Width, Depth
        if img.shape[1] > self.MAX_DIM or img.shape[0] > self.MAX_DIM:
            if img.shape[1] > img.shape[0]:
                # Width > Height
                width = self.MAX_DIM
                height = math.floor(width / img.shape[1] * img.shape[0])
            else:
                # Height >= Width
                height = self.MAX_DIM
                width = math.floor(height / img.shape[0] * img.shape[1])

            dim = (width, height)
            img = cv2.resize(img, dim, interpolation=cv2.INTER_AREA)

        img = cv2.cvtColor(img, cv2.COLOR_BGR2RGB)

        # NOTE: reshaping to a list of pixel [r,g,b] values
        # Width * Height, 3
        img = img.reshape((img.shape[1] * img.shape[0], 3))
        self._image = img

        # using k-means to cluster pixels
        kmeans = KMeans(n_clusters=self.CLUSTERS, n_init='auto')
        kmeans.fit(img)

        # cluster centers are dominant colors
        self._colors = kmeans.cluster_centers_.astype(int)

        # save cluster labels for each pixel
        self._labels = kmeans.labels_

        return self._colors.tolist()
