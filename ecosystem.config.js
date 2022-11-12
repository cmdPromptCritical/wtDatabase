module.exports = {
  apps: [{
    script: "bin/www2",
    watch: ["bin", "handlers", "routes", "views", "app.js", "db.js"],
    // Delay between restart
    env:{
          "PORT": 3000,
        },
    env_production:{
      NODE_ENV: "production"
    },
    watch_delay: 1000,
    ignore_watch : ["node_modules", "public/pub"],
  }]
}
