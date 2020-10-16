# define your tests here
import pytest

from web_nornir.job_discovery import JobDiscovery
import web_nornir.tests.test_package


class TestWebNornir:
    jd = JobDiscovery(web_nornir.tests.test_package.__path__)

    def test_get_job_definitions(self):
        result = self.jd.get_job_definitions()
        assert len(list(filter(lambda x: x['name'] == 'hello_test', result))) > 0

    def test_get_job_function(self):
        result = self.jd.get_job_function('hello_test', 'job_function')
        assert callable(result)

    def test_get_job_function_with_invalid_name(self):
        wrong_name = 'wrong_name'
        with pytest.raises(Exception) as e:
            assert self.jd.get_job_function(wrong_name, 'job_function')
        assert str(e.value) == f'job template "{wrong_name}" not found'

