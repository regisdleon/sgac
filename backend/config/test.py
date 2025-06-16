from django.core.management import call_command
from django.db import connections
from django.db.migrations.executor import MigrationExecutor
from django.test.runner import DiscoverRunner

from .production import *

# Use a fast password hasher to speed up tests
PASSWORD_HASHERS = [
    "django.contrib.auth.hashers.MD5PasswordHasher",
]

# Faster, memory-based email backend
EMAIL_BACKEND = "django.core.mail.backends.locmem.EmailBackend"

# Optional: Use a test-specific media folder
MEDIA_ROOT = os.path.join(BASE_DIR, "test_media")
STATIC_ROOT = os.path.join(BASE_DIR, "test_static")

# Optional: Simplify logging during tests
LOGGING = {
    "version": 1,
    "disable_existing_loggers": True,
}

class KeepDatabaseDiscoverRunner(DiscoverRunner):

    def __init__(
        self,
        pattern=None,
        top_level=None,
        verbosity=1,
        interactive=True,
        failfast=False,
        reverse=False,
        debug_mode=False,
        debug_sql=False,
        parallel=0,
        tags=None,
        exclude_tags=None,
        test_name_patterns=None,
        pdb=False,
        buffer=False,
        enable_faulthandler=True,
        timing=False,
        shuffle=False,
        logger=None,
        durations=None,
        **kwargs,
    ):
        super().__init__(
            pattern=None,
            top_level=None,
            verbosity=1,
            interactive=True,
            failfast=False,
            reverse=False,
            debug_mode=False,
            debug_sql=False,
            parallel=0,
            tags=None,
            exclude_tags=None,
            test_name_patterns=None,
            pdb=False,
            buffer=False,
            enable_faulthandler=True,
            timing=False,
            shuffle=False,
            logger=None,
            durations=None,
            **kwargs,
        )
        self.keepdb = True

    def setup_databases(self, **kwargs):
        # Ensure migrations are up to date
        for alias in connections:
            connection = connections[alias]
            executor = MigrationExecutor(connection)
            targets = executor.loader.graph.leaf_nodes()

            if executor.migration_plan(targets):  # pending migrations
                print("Applying pending migrations before test run...")
                call_command("migrate", verbosity=1, interactive=False)

        return super().setup_databases(**kwargs)


TEST_RUNNER = "config.test.KeepDatabaseDiscoverRunner"
