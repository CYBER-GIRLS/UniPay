{ pkgs }: {
  deps = [
    pkgs.postgresql
    pkgs.unzip
    pkgs.lsof
    pkgs.wget
    pkgs.sqlite
    pkgs.zip
    pkgs.tree
    pkgs.ffmpeg.bin
    pkgs.unixtools.ping
    pkgs.jq
    pkgs.redis
    pkgs.grpc
    pkgs.curl
    pkgs.strace
  ];
}