import json
from collections import OrderedDict
from pprint import pprint

from nornir.core.task import Result, AggregatedResult, MultiResult
from nornir_napalm.plugins.tasks import napalm_ping
from nornir_utils.plugins.functions import print_result
from web_nornir.nornir_handler import NornirHandler


class TestTemplate:
    file_name = 'get_interfaces.py'
    function_name = 'job_function'

    def get_package_path(self):
        return 'web_nornir/job_templates'


def main():
    nh = NornirHandler('web_nornir/nornir_config/inslab_config/hosts.yaml',
                       'web_nornir/nornir_config/inslab_config/groups.yaml')

    result = nh.execute_task(TestTemplate(), {'name': 'ping'}, {'hosts': ['spine1', 'spine2']})
    # result = nh.execute_task(TestTemplate(), {'name': 'interfaces'}, {'hosts': ['spine1']})
    # print_result(result)
    # s = result_serializer(result)
    # print(s)
    # print(json.dumps(s))
    print(json.dumps(result))


def result_serializer(result: Result) -> dict:
    serialized = {}
    if isinstance(result, AggregatedResult):
        serialized.update({'name': result.name})
        for host, host_data in sorted(result.items()):
            x = result_serializer(host_data)
            serialized.update(x)
    elif isinstance(result, MultiResult):
        res = {}
        x = {'command': _result_individual_serializer(result[0])}
        res.update(x)
        y = {'result': [] }
        for r in result[1:]:
            y['result'].append(result_serializer(r))
            res.update(y)
        serialized.update(res)
    elif isinstance(result, Result):
        serialized.update({'result': _result_individual_serializer(result)})

    return serialized


def _result_individual_serializer(result: Result):
    individual_result = getattr(result, "result", "")
    if not isinstance(individual_result, str):
        if isinstance(individual_result, OrderedDict):
            return json.dumps(individual_result, ident=2)
        else:
            return f'{individual_result}'
    elif individual_result:
        return individual_result


if __name__ == "__main__":
    main()
