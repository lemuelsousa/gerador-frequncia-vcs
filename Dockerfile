FROM node:18-slim

# Install libreoofice
RUN apt update && \
    apt install -y libreoffice && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Install node dependencies
COPY package.json tsconfig.json ./
RUN npm install

# Copy rest of the files
COPY . .

#Compile Typescritp
RUN npm run build

# Expose port
EXPOSE 3000

# Start the server
CMD ["npm", "run", "start"]
