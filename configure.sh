mkdir -p lib
cd lib
if ! [ -d webL10n ]; then
  git clone git://github.com/fabi1cazenave/webL10n.git
fi
cd ..
