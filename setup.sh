#!/bin/bash

set -ex

python_packages=(
  # packages from blueprints
  'flask^3.0'
  'gunicorn^23.0.0'
  'inotify^0.2.10'
  'python-fasthtml^0.4.5'
  'openai^1.42.0'
  'replit^4.0.0'
  'streamlit^1.12.1'
  'trafilatura^1.12.1'
  'replit-object-storage^1.0.2'

  # packages kept back for peaceful coexistence
  'tenacity~8.5.0'
  'numpy~1.26.4'

  # top 50-ish packages from the agent
  requests
  pandas
  matplotlib
)

nodejs_packages=(
  # hand-curated list of packages
  pg
  vite
  tailwindcss
  postcss
  autoprefixer
  shadcn-ui
  tailwindcss-animate
  class-variance-authority
  clsx
  tailwind-merge
  lucide-react
  @radix-ui/react-tabs
  @radix-ui/react-icons
  react
  @types/react
  react-dom
  @types/react-dom
  bootstrap
  typescript
  node-fetch
  @types/node
  recharts

  # top 50-ish packages from the agent
  express
  axios
  @types/axios
  tailwindcss
  react-scripts
  next
  cheerio
  cors
  chart.js
  http-server
  @vitejs/plugin-react
  react-bootstrap
  react-chartjs-2
  class-variance-authority
  tailwind-merge
  clsx
  dotenv
  nodemon
  @babel/preset-env
  @radix-ui/react-slot
  babel-loader
  @babel/preset-react
  @babel/core
  webpack
  webpack-cli
  lucide-react
  canvas-confetti
  tailwindcss-animate
  react-router-dom
  openai
  webpack-dev-server
  @sinclair/typebox
  three
  csv-parse
  html-webpack-plugin
  socket.io-client
  body-parser
  create-next-app
  recharts
  framer-motion
  react-native
  @emotion/react
  @emotion/styled
  vite-express
  css-loader
  style-loader
  create-react-app
  react-hook-form
  @babel/plugin-proposal-private-property-in-object
  expo
)

#rm -rf .pythonlibs/ node_modules/ package-lock.json package.json poetry.lock pyproject.toml .cache/pypoetry/
upm add -l python "${python_packages[@]}"
#upm add -l nodejs "${nodejs_packages[@]}"