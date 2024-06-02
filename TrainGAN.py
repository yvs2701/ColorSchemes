import time
import torch
from torch import nn
from GAN import Generator, Discriminator


class TrainGAN:
    def __init__(self):
        pass

    def train(self, BATCH_SIZE, train_loader):
        generator = Generator()
        discriminator = Discriminator()

        LR = 0.001
        EPOCHS = 300
        loss_fn = nn.BCELoss()

        d_optim = torch.optim.Adam(discriminator.parameters(), lr=LR)
        g_optim = torch.optim.Adam(generator.parameters(), lr=LR)
        latent_space_samples = torch.rand(size=(
            BATCH_SIZE, 2, 3), generator=torch.manual_seed(111))*255  # fixed noise for generator

        REAL_DATA_LABEL = torch.ones((BATCH_SIZE, 1))  # 1 - real data
        GEN_DATA_LABEL = torch.zeros((BATCH_SIZE, 1))  # 0 - fake data
        DATA_LABELS = torch.cat((REAL_DATA_LABEL, GEN_DATA_LABEL))

        for epoch in range(1, EPOCHS + 1):
            for n, (real_samples, _) in enumerate(train_loader):
                generated_samples = generator(latent_space_samples)

                # concatenate all the data into a single input and target (or labels) tensor
                all_samples = torch.cat((real_samples, generated_samples))

                # Training the discriminator
                d_optim.zero_grad()  # equivalent to discriminator.zero_gread()
                output_discriminator = discriminator(all_samples)

                loss_discriminator = loss_fn(output_discriminator, DATA_LABELS)
                loss_discriminator.backward()
                d_optim.step()

                # Training the generator
                g_optim.zero_grad()  # equivalent to generator.zero_gread()
                generated_samples = generator(latent_space_samples)
                output_discriminator = discriminator(generated_samples)

                # Generator loss
                # Generator must produce realistic outputs
                loss_generator = loss_fn(output_discriminator, REAL_DATA_LABEL)
                loss_generator.backward()
                g_optim.step()

                if (epoch % 10 == 0) and (n == BATCH_SIZE - 1):
                    loss_value = f"Epoch: {epoch}. Discriminator Loss: {loss_discriminator}. Generator Loss: {loss_generator}"
                    print(loss_value)

        ts = str(time.time())
        torch.save(generator.state_dict(), './model/Generator.'+ts)
        torch.save(discriminator.state_dict(), './model/Discriminator.'+ts)
