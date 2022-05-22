module.exports = {
    apps : [{
      name: "whatsapp",
      version: "1.0.0",
      script: "ts-node ./src/server.ts",
      namespace: "WHATSAPP",

       // Delay between restart
      //exec_mode: "cluster",
      //autorestart: true,
      watch: false,
      max_memory_restart: '512M',
      //watch_delay: 10000,
      //kill_timeout: 3000,
      //instances: "max",
      ignore_watch : ["node_modules","tokens"],
      watch_options: {
        "followSymlinks": false
      },

      env: {
        NODE_ENV: "development",
      },
      env_test: {
        NODE_ENV: "test",
      },
      env_production: {
        NODE_ENV: "production",
      }
    }]
  }