from nornir.core.task import AggregatedResult, MultiResult, Result


def serialize_result(aggregated_result: AggregatedResult) -> dict:
    try:
        result = {
            'failed': aggregated_result.failed,
            'hosts': []
        }

        for hostname, host_result in sorted(aggregated_result.items()):
            host_dict = {
                'hostname': host_result.host.hostname,
                'name': host_result.host.name,
                'failed': host_result.failed,
                'result': []
            }
            attr = f'{"exception" if host_result.failed else "result"}'

            if isinstance(host_result, MultiResult):
                host_dict['result'].append(_get_formatted_result(host_result[0], attr))
                for r in host_result[1:]:
                    host_dict['result'].append(_get_formatted_result(r, attr))
            elif isinstance(host_result, Result):
                host_dict['result'].append(_get_formatted_result(host_result, attr))
            result['hosts'].append(host_dict)
        return result
    except:
        return {'failed': True, 'exception': 'Exception thrown, please check backend log'}


def _get_formatted_result(result: Result, attr: str):
    x = getattr(result, attr)
    if isinstance(x, dict) or isinstance(x, list) and not isinstance(x, MultiResult):
        return x
    else:
        return f'{x}'
